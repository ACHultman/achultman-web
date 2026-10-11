import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/functions';
import { checkRateLimit } from './lib/rate-limit';

export const config = { matcher: '/api/:path*' };

export default async function proxy(request: NextRequest) {
    // Contact enforces its own limit at the SMTP boundary, even without middleware.
    if (request.nextUrl.pathname.replace(/\/$/, '') === '/api/v1/contact') {
        return NextResponse.next();
    }
    // Only Vercel's trusted proxy may supply the client address. Other hosts
    // share a bucket until a trusted reverse proxy is explicitly configured.
    const ip = process.env.VERCEL === '1' ? ipAddress(request) : undefined;
    const { status, headers } = await checkRateLimit(ip || 'unknown');
    const response =
        status === 200
            ? NextResponse.next()
            : NextResponse.json(
                  {
                      message:
                          status === 429
                              ? 'Too many requests'
                              : 'Service unavailable',
                  },
                  { status, headers: { 'Cache-Control': 'no-store' } }
              );
    for (const [name, value] of Object.entries(headers))
        response.headers.set(name, value);
    return response;
}
