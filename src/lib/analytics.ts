import posthog from 'posthog-js';

type LeadIntentSource =
    | 'hero'
    | 'offer'
    | 'navbar_desktop'
    | 'navbar_mobile'
    | 'contact_email'
    | 'contact_linkedin';

type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

const isAnalyticsEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function captureEvent(
    event: string,
    properties?: AnalyticsProperties
) {
    if (!isAnalyticsEnabled) return;
    posthog.capture(event, properties);
}

export function captureClientException(error: unknown) {
    if (!isAnalyticsEnabled) return;
    posthog.captureException(error);
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
