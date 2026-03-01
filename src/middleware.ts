import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/functions';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Rate limit: 5 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
});

export const config = {
    matcher: '/api/:path*',
};

const LOCAL_IP = '127.0.0.1';

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

    try {
        const { success, limit, remaining, reset } =
            await ratelimit.limit(ip);

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
        // Allow request to proceed if rate limiting fails
        return NextResponse.next();
    }
}
