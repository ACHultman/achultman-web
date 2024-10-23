import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        Sentry.init({
            dsn:
                SENTRY_DSN ||
                'https://98885e1818014bf197142a70aeb117e5@o4504819206389760.ingest.sentry.io/4504819208093696',
            tracesSampleRate: 1.0,
        });
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        Sentry.init({
            dsn:
                SENTRY_DSN ||
                'https://98885e1818014bf197142a70aeb117e5@o4504819206389760.ingest.sentry.io/4504819208093696',
            tracesSampleRate: 1.0,
        });
    }
}
