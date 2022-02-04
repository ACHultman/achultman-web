import { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";

import Layout from "../components/Layout";
import theme from "../theme";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider resetCSS theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ChakraProvider>
);

export default MyApp;
