import type { PostHog } from 'posthog-js';

type LeadIntentSource =
    | 'hero'
    | 'offer'
    | 'navbar_desktop'
    | 'navbar_mobile'
    | 'calculator'
    | 'contact_email'
    | 'contact_linkedin';

type AnalyticsProperties = Record<
    string,
    string | string[] | number | boolean | undefined
>;

let client: Promise<PostHog | null> | undefined;

export function getAnalytics(): Promise<PostHog | null> {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || typeof window === 'undefined') return Promise.resolve(null);
    client ??= import('posthog-js')
        .then(({ default: posthog }) => {
            posthog.init(key, {
                api_host: '/ingest',
                ui_host: 'https://us.posthog.com',
                defaults: '2026-01-30',
                autocapture: false,
                // Vercel Analytics owns page views; PostHog records explicit events.
                capture_pageview: false,
                capture_pageleave: false,
                disable_session_recording: true,
                disable_surveys: true,
                advanced_disable_flags: true,
                capture_exceptions: true,
                debug: process.env.NODE_ENV === 'development',
            });
            return posthog;
        })
        // Telemetry is optional: a blocked download must not break the site.
        .catch(() => null);
    return client;
}

export function captureEvent(event: string, properties?: AnalyticsProperties) {
    void getAnalytics()
        .then((posthog) => posthog?.capture(event, properties))
        .catch(() => {});
}

export function captureClientException(error: unknown) {
    void getAnalytics()
        .then((posthog) => posthog?.captureException(error))
        .catch(() => {});
}

export function captureLeadIntent(
    source: LeadIntentSource,
    destination: 'contact_form' | 'email' | 'linkedin' = 'contact_form'
) {
    captureEvent('lead_intent_clicked', {
        source,
        destination,
    });
}
