import { Container } from "@chakra-ui/react";
import Head from "next/head";
import Home from "../components/Home";

const Index = () => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <main>
      <Container maxW="container.lg" mt={["5", "10"]}>
        <Home />
      </Container>
    </main>
  </>
);

export default Index;
