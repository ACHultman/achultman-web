import Head from "next/head";

import { Code, Text } from "@chakra-ui/react";

import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Main } from "../components/Main";

const Index = () => (
  <>
    <Head>
      <title>Adam Hultman</title>
      <meta
        name="description"
        content="Adam Hultman | Full-stack developer, UI/UX Designer"
      />
      <meta property="og:type" content="website" />
      <meta name="robots" content="follow, index" />
      <meta property="og:url" content="https://hultman.tech/" />
      <meta
        property="og:title"
        content="Adam Hultman | Full-stack developer, UI/UX Designer"
      />
      <meta property="og:image" content="/meta-image.jpg" />
    </Head>
    <Container height="100vh">
      <Hero />
      <Main>
        <Text>
          Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code> +{" "}
          <Code>TypeScript</Code>.
        </Text>
      </Main>
    </Container>
  </>
);

export default Index;
