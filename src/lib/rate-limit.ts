import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const readLimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
    prefix: 'hultman:read',
    timeout: 3000,
});
const contactLimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    prefix: 'hultman:contact',
    timeout: 3000,
});

export async function checkRateLimit(ip: string, contact = false) {
    // Never let a request header opt a production request out of protection.
    if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
        return { status: 200, headers: {} };
    }
    try {
        const result = await (contact ? contactLimit : readLimit).limit(ip);
        // Upstash returns success=true on timeout rather than throwing.
        if (result.reason === 'timeout') throw new Error('Limiter timed out');
        const headers: Record<string, string> = {
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
        };
        if (!result.success) {
            headers['Retry-After'] = String(
                Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
            );
        }
        return { status: result.success ? 200 : 429, headers };
    } catch {
        return { status: 503, headers: { 'Retry-After': '30' } };
    }
}
