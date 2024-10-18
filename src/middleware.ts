import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
    redis: kv,
    // 5 requests from the same IP in 10 seconds
    limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

const LOCAL_IP = '127.0.0.1';

export default async function middleware(request: NextRequest) {
    const ip = request.ip ?? LOCAL_IP;

    if (LOCAL_IP === ip) {
        return NextResponse.next();
    }

    const { success, pending, limit, reset, remaining } =
        await ratelimit.limit(ip);

    return success
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/blocked', request.url));
}
