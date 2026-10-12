import { getAnalytics } from './src/lib/analytics';

// Analytics must not compete with the initial document and hydration.
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    const schedule = () => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => void getAnalytics(), {
                timeout: 3000,
            });
        } else {
            setTimeout(() => void getAnalytics(), 0);
        }
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
}
