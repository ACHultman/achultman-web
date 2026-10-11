import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let limits: { read: Ratelimit; contact: Ratelimit } | undefined;

function getLimits() {
    if (limits) return limits;
    // Keep existing deployments working; never combine credentials from two pairs.
    const useUpstash = Boolean(
        process.env.UPSTASH_REDIS_REST_URL ||
        process.env.UPSTASH_REDIS_REST_TOKEN
    );
    const url = useUpstash
        ? process.env.UPSTASH_REDIS_REST_URL
        : process.env.KV_REST_API_URL;
    const token = useUpstash
        ? process.env.UPSTASH_REDIS_REST_TOKEN
        : process.env.KV_REST_API_TOKEN;
    if (!url || !token) throw new Error('Redis credentials are required');
    const redis = new Redis({ url, token });
    limits = {
        read: new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, '10 s'),
            prefix: 'hultman:read',
            timeout: 3000,
        }),
        contact: new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, '10 m'),
            prefix: 'hultman:contact',
            timeout: 3000,
        }),
    };
    return limits;
}

export async function checkRateLimit(ip: string, contact = false) {
    // Never let a request header opt a production request out of protection.
    if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
        return { status: 200, headers: {} };
    }
    try {
        const limit = getLimits();
        const result = await (contact ? limit.contact : limit.read).limit(ip);
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
