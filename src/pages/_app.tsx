import "../main.css"

import { AppProps } from "next/app"
import { DefaultSeo } from "next-seo"

import { ChakraProvider } from "@chakra-ui/react"

import { MotionConfig } from "framer-motion"

import Layout from "../components/Layout"
import theme from "../theme"
import SEO from "../next-seo.config"

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
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
