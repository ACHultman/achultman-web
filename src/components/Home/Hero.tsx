import {
  Box,
  Button,
  ButtonProps,
  Heading,
  Link,
  SlideFade,
} from "@chakra-ui/react";

import Paragraph from "../Paragraph";
import { motion } from "framer-motion";
import Contact from "./Contact";

export const MotionButton = motion<ButtonProps>(Button);

const Hero = () => {
  return (
    <SlideFade in={true} offsetY={-80}>
      <Box>
        <Heading
          as="h1"
          fontSize={{ base: "28px", md: "40px", lg: "48px" }}
          mb={3}
        >
          Hey, I’m Adam
        </Heading>
        <Paragraph fontSize="2xl" lineHeight={1.6}>
          Full-stack Developer, Designer, ML Engineer, Cybersecurity Enthusiast.
          I love using{" "}
          <Link
            color="green.500"
            href="https://www.nodejs.org"
            isExternal
            fontWeight="500"
          >
            Node.JS
          </Link>{" "}
          and{" "}
          <Link
            color="green.500"
            href="https://www.reactjs.org"
            fontWeight="500"
            isExternal
          >
            React
          </Link>
          .
        </Paragraph>
        <Contact />
      </Box>
    </SlideFade>
  );
};

export default Hero;
