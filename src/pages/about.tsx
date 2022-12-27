import Head from "next/head"
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
  VStack,
} from "@chakra-ui/react"
import Paragraph from "../components/Paragraph"
import { useState } from "react"
import Contact from "../components/Home/Contact"

const About = () => {
  const [show, setShow] = useState(false)

  const coolStuff = [
    "React",
    "JavasSript",
    "Next.js",
    "Machine Learning",
    "Cybersecurity",
    "Physics",
    "Android",
    "Figma",
    "Video Games",
    "Movies",
    "Coffee",
    "Lots of coffee",
  ]

  const handleToggle = () => setShow(!show)

  return (
    <>
      <Head>
        <title>Adam Hultman | About</title>
      </Head>
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
              <VStack gap={8}>
                <VStack>
                  <Paragraph fontSize="xl" lineHeight={1.6}>
                    I graduated with a Bachelor of Software Engineering degree
                    from the University of Victoria. My professional interests
                    include cross-platform software development, cybersecurity,
                    and artificial intelligence. I love to explore and innovate
                    with new technologies. In my free time I enjoy working on
                    new software projects, playing guitar, and hiking.
                  </Paragraph>
                  <Paragraph fontSize="xl" lineHeight={1.6}>
                    I was involved in a couple of computer science and
                    engineering student clubs: VikeLabs and VikeSec. These are
                    clubs for software development and cybersecurity,
                    respectively. For VikeLabs, I've had the pleasure of hosting
                    a react testing workshop and am working on a degree planner
                    web application for UVic students. With VikeSec, I've
                    participated in a few CTFs and have learned a lot.
                  </Paragraph>
                  <Paragraph fontSize="xl" lineHeight={1.6}>
                    My experience in software industry includes multiple roles
                    working as a full-stack or front-end software developer.
                    These roles have provided invaluable experience working in a
                    team environment and have helped me develop my skills in a
                    variety of areas.
                  </Paragraph>
                </VStack>
                <VStack w={"100%"} p={4}>
                  <Paragraph fontSize="xl" lineHeight={1.6}>
                    If you've read this far, feel free to reach out!
                  </Paragraph>
                  <Contact />
                </VStack>
              </VStack>
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
            as="h2"
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
    </>
  )
}

export default About
