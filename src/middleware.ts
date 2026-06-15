import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/functions';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// General rate limit for read-only API routes: 5 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
});

// Tighter limit for the chat endpoint — the only route with real (OpenAI)
// cost, and the one worth protecting most aggressively from abuse.
const chatRatelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
    prefix: '@upstash/ratelimit:chat',
});

export const config = {
    matcher: '/api/:path*',
};

const LOCAL_IP = '127.0.0.1';
const CHAT_PATH = '/api/v1/chat';

/**
 * Middleware to apply rate limiting to API routes
 * Prevents abuse by limiting requests per IP address
 */
export default async function middleware(request: NextRequest) {
    const ip = ipAddress(request) ?? LOCAL_IP;

    // Skip rate limiting for local development
    if (LOCAL_IP === ip) {
        return NextResponse.next();
    }

    const isChat = request.nextUrl.pathname.startsWith(CHAT_PATH);
    const limiter = isChat ? chatRatelimit : ratelimit;

    try {
        const { success, limit, remaining, reset } = await limiter.limit(ip);

        const response = success
            ? NextResponse.next()
            : NextResponse.json(
                  {
                      error: 'Too many requests',
                      message: 'Please try again later',
                  },
                  { status: 429 }
              );

        // Add rate limit headers to response
        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', reset.toString());

        return response;
    } catch (error) {
        console.error('Rate limiting error:', error);
        // Fail closed for the billable chat endpoint so an Upstash outage
        // can't open an unmetered window on the OpenAI key; fail open for the
        // read-only Notion routes where availability matters more.
        if (isChat) {
            return NextResponse.json(
                {
                    error: 'Service unavailable',
                    message: 'Please try again later',
                },
                { status: 503 }
            );
        }
        return NextResponse.next();
    }
}
