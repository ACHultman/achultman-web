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
          Full-stack Developer, Designer, Cybersecurity + ML Enthusiast
        </Paragraph>
        <Paragraph fontSize="2xl" lineHeight={1.6}>
          Learning every day.
        </Paragraph>
        <Contact />
      </Box>
    </SlideFade>
  );
};

export default Hero;
