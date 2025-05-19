import '../main.css';
import React from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ChakraProvider, localStorageManager } from '@chakra-ui/react';
import { DefaultSeo } from 'next-seo';
import { SpeedInsights } from '@vercel/speed-insights/next';

import createEmotionCache from '../utils/createEmotionCache';
import theme from '../theme';
import SEO from '../next-seo.config';
import Layout from '@components/Layout';

const clientSideEmotionCache = createEmotionCache();

const Analytics = dynamic(
    () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
    { ssr: false }
);

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: MyAppProps) {
    const colorModeManager = localStorageManager;

    return (
        <CacheProvider value={emotionCache}>
            <DefaultSeo {...SEO} />
            <Analytics />
            <SpeedInsights />
            <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </CacheProvider>
    );
}

export default MyApp;
