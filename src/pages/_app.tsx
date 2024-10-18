import '../main.css'

import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { MotionConfig } from 'framer-motion'

import { Chakra } from '@components/Chakra'
import Layout from '@components/Layout'
import theme from '../theme'
import SEO from '../next-seo.config'

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <DefaultSeo {...SEO} />
            <Analytics />
            <Chakra cookies={pageProps.cookies}>
                <MotionConfig reducedMotion="user">
                    <ChakraProvider theme={theme}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ChakraProvider>
                </MotionConfig>
            </Chakra>
        </>
    )
}

export default App
