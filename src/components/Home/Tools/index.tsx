import { Heading, SlideFade, Grid, GridProps } from "@chakra-ui/react";
import {
  FaNodeJs,
  FaReact,
  FaJs,
  FaDatabase,
  FaGitAlt,
  FaFigma,
} from "react-icons/fa";
import { motion } from "framer-motion";

import ToolCard from "./ToolCard";
import Paragraph from "../../Paragraph";

const tools = [
  {
    name: "Node.js",
    description: "Chrome's V8 JavaScript engine for server-side javascript.",
    icon: <FaNodeJs fontSize="20px" />,
    url: "https://www.nodejs.org",
  },
  {
    name: "NextJS",
    description:
      "I would argue that it is one of the best frameworks for React.",
    icon: <FaJs fontSize="20px" />,
    url: "https://nextjs.org/",
  },
  {
    name: "React.js",
    description:
      "My favourite library for building Single Page Applications with JS.",
    icon: <FaReact fontSize="20px" />,
    url: "https://www.reactjs.org",
  },
  {
    name: "MongoDB",
    description: "It has its use cases. I'm a fan of noSQL databases.",
    icon: <FaDatabase fontSize="20px" />,
    url: "https://www.mongodb.com/",
  },
  {
    name: "GIT",
    description:
      "The most used VCS of our time. Can't start a project without it.",
    icon: <FaGitAlt fontSize="20px" />,
    url: "https://medium.com/swlh/things-about-git-and-github-you-need-to-know-as-developer-907baa0bed79",
  },
  {
    name: "Figma",
    description: "Figma is my favourite tool for UI/UX design.",
    icon: <FaFigma fontSize="20px" />,
    url: "https://www.figma.com/",
  },
];

export const MotionGrid = motion<GridProps>(Grid);

const Tools = () => {
  return (
    <SlideFade in={true} offsetY={80} delay={0.2}>
      <SlideFade
        in={true}
        offsetX={-80}
        delay={{ enter: 1.6, exit: 1.6 }}
        transition={{ enter: { duration: 1 } }}
      >
        <Heading
          as="h1"
          fontSize={{ base: "24px", md: "30px", lg: "36px" }}
          mb={3}
        >
          Primary Technologies
        </Heading>
      </SlideFade>
      <SlideFade
        in={true}
        offsetX={-80}
        delay={{ enter: 1.6, exit: 1.6 }}
        transition={{ enter: { duration: 1 } }}
      >
        <Paragraph fontSize="xl" lineHeight={1.6}>
          As a Full-stack Web Developer there are many tools at one's disposal;
          these are among my favourite.
        </Paragraph>
      </SlideFade>
      <SlideFade
        in={true}
        offsetX={80}
        delay={{ enter: 1.6, exit: 1.6 }}
        transition={{ enter: { duration: 1 } }}
      >
        <MotionGrid
          mt={10}
          templateColumns={["1fr", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
          gap={5}
        >
          {tools.map((tool) => (
            <motion.div key={tool.name} layout>
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </MotionGrid>
      </SlideFade>
    </SlideFade>
  );
};

export default Tools;
