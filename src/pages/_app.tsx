import '../main.css';
import React, { useSyncExternalStore } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import type { EmotionCache } from '@emotion/react';
import { DefaultSeo } from 'next-seo';

import SEO from '../next-seo.config';
import Layout from '@components/Layout';
import ErrorBoundary from '@components/ErrorBoundary';

const InteractiveProviders = dynamic(
    () => import('../components/InteractiveProviders')
);

const Analytics = dynamic(
    () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
    { ssr: false }
);

const SpeedInsights = dynamic(
    () =>
        import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
    { ssr: false }
);

export interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const subscribeHostname = () => () => {};
const isRemoteBrowser = () =>
    !['localhost', '127.0.0.1'].includes(window.location.hostname);
const serverTelemetry = () => false;
function SiteTelemetry() {
    const shouldLoad = useSyncExternalStore(
        subscribeHostname,
        isRemoteBrowser,
        serverTelemetry
    );

    if (!shouldLoad) return null;

    return (
        <>
            <Analytics />
            <SpeedInsights />
        </>
    );
}

function MyApp({ Component, pageProps, router, emotionCache }: MyAppProps) {
    const needsInteractiveProviders =
        router.pathname.startsWith('/tools/') &&
        router.pathname !== '/tools/regex-tester';
    const content = <Component {...pageProps} />;
    return (
        <>
            <DefaultSeo {...SEO} />
            <SiteTelemetry />
            <Layout>
                <ErrorBoundary>
                    {needsInteractiveProviders ? (
                        <InteractiveProviders emotionCache={emotionCache}>
                            {content}
                        </InteractiveProviders>
                    ) : (
                        content
                    )}
                </ErrorBoundary>
            </Layout>
        </>
    );
}

export default MyApp;
