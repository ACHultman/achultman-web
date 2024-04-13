// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
    dsn:
        SENTRY_DSN ||
        'https://98885e1818014bf197142a70aeb117e5@o4504819206389760.ingest.sentry.io/4504819208093696',
    tracesSampleRate: 1.0,
})
