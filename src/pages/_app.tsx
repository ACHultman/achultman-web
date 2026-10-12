import '../main.css';
import React, { useSyncExternalStore } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { DefaultSeo } from 'next-seo';

import createEmotionCache from '../utils/createEmotionCache';
import SEO from '../next-seo.config';
import Layout from '@components/Layout';
import ErrorBoundary from '@components/ErrorBoundary';

const InteractiveProviders = dynamic(
    () => import('../components/InteractiveProviders')
);

const clientSideEmotionCache = createEmotionCache();

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

function MyApp({
    Component,
    pageProps,
    router,
    emotionCache = clientSideEmotionCache,
}: MyAppProps) {
    const needsInteractiveProviders =
        ['/books', '/bookmarks', '/contact'].includes(router.pathname) ||
        (router.pathname.startsWith('/tools/') &&
            router.pathname !== '/tools/regex-tester');
    const content = <Component {...pageProps} />;
    return (
        <CacheProvider value={emotionCache}>
            <DefaultSeo {...SEO} />
            <SiteTelemetry />
            <Layout>
                <ErrorBoundary>
                    {needsInteractiveProviders ? (
                        <InteractiveProviders>{content}</InteractiveProviders>
                    ) : (
                        content
                    )}
                </ErrorBoundary>
            </Layout>
        </CacheProvider>
    );
}

export default MyApp;
