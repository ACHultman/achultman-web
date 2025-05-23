import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/functions';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export const config = {
    matcher: '/(api/.*)',
};

const LOCAL_IP = '127.0.0.1';

export default async function middleware(request: NextRequest) {
    const ip = ipAddress(request) ?? LOCAL_IP;

    if (LOCAL_IP === ip) {
        return NextResponse.next();
    }

    const { success } = await ratelimit.limit(ip);

    return success
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/blocked', request.url));
}
