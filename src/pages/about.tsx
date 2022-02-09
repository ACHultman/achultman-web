import Head from "next/head";
import {
  Box,
  Container,
  Heading,
  SlideFade,
  Divider,
  Button,
  Collapse,
  LightMode,
  Tag,
} from "@chakra-ui/react";
import Paragraph from "../components/Paragraph";
import { useState } from "react";

const About = () => {
  const [show, setShow] = useState(false);

  const coolStuff = [
    "React",
    "Javascript",
    "AI",
    "Space",
    "Android",
    "Movies",
    "Figma",
    "Coffee",
  ];

  const handleToggle = () => setShow(!show);

  return (
    <div>
      <Head>
        <title>Adam Hultman | About</title>
      </Head>
      <main>
        <Container maxW="container.lg" mt={10}>
          <SlideFade in={true} offsetY={80}>
            <Box>
              <Heading
                as="h1"
                fontSize={{ base: "28px", md: "32px", lg: "36px" }}
                mb={4}
              >
                About Me
              </Heading>
              <Collapse in={show} startingHeight={100}>
                <Paragraph fontSize="xl" lineHeight={1.6}>
                  TODO: write this
                </Paragraph>
              </Collapse>
              <LightMode>
                <Button
                  size="sm"
                  onClick={handleToggle}
                  mt="1rem"
                  colorScheme="green"
                  bg="green.500"
                >
                  Show {show ? "Less" : "More"}
                </Button>
              </LightMode>
            </Box>
            <Divider my={10} />
          </SlideFade>
          <SlideFade in={true} offsetY={80} delay={0.2}>
            <Heading
              as="h1"
              fontSize={{ base: "24px", md: "30px", lg: "36px" }}
              mb={3}
            >
              Cool Stuff
            </Heading>
            <Paragraph fontSize="xl" lineHeight={1.6}>
              {coolStuff.map((item) => (
                <Tag
                  size="lg"
                  colorScheme="green"
                  key={item}
                  marginY={2}
                  marginRight={2}
                >
                  {item}
                </Tag>
              ))}
            </Paragraph>
          </SlideFade>
        </Container>
      </main>
    </div>
  );
};

export default About;
