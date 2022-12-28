import "../main.css"

import { AppProps } from "next/app"
import Script from "next/script"
import Head from "next/head"
import { DefaultSeo } from "next-seo"

import { ChakraProvider } from "@chakra-ui/react"
import { MotionConfig } from "framer-motion"

import Layout from "../components/Layout"
import theme from "../theme"
import SEO from "../next-seo.config"

const gtmScript = `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NDX34CN');</script>
<!-- End Google Tag Manager -->
`

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <Script dangerouslySetInnerHTML={{ __html: gtmScript }} />
    </Head>
    <DefaultSeo {...SEO} />

    <MotionConfig reducedMotion="user">
      <ChakraProvider resetCSS theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </MotionConfig>
  </>
)

export default MyApp
