import { Heading, SlideFade, Grid, GridProps } from "@chakra-ui/react"
import {
  FaNodeJs,
  FaReact,
  FaJs,
  FaDatabase,
  FaGitAlt,
  FaFigma,
} from "react-icons/fa"
import { motion } from "framer-motion"

import ToolCard from "./ToolCard"

const tools = [
  {
    name: "Node.js",
    description:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to execute JavaScript on the server side.",
    icon: <FaNodeJs fontSize="20px" />,
    url: "https://www.nodejs.org",
  },
  {
    name: "NextJS",
    description:
      "Next.js is a JavaScript framework for building web applications using React. It offers server-side rendering, automatic code splitting, static export, and routing.",
    icon: <FaJs fontSize="20px" />,
    url: "https://nextjs.org/",
  },
  {
    name: "React.js",
    description:
      "React is a JavaScript library for building user interfaces, allowing for the creation of reusable components and efficient updates to the view of web applications.",
    icon: <FaReact fontSize="20px" />,
    url: "https://www.reactjs.org",
  },
  {
    name: "MongoDB",
    description:
      "MongoDB is a cross-platform, document-oriented database that stores data in JSON-like documents with optional schemas.",
    icon: <FaDatabase fontSize="20px" />,
    url: "https://www.mongodb.com/",
  },
  {
    name: "Git",
    description:
      "Git is a version control system that allows developers to track changes to their code and collaborate with other developers on projects.",
    icon: <FaGitAlt fontSize="20px" />,
    url: "https://git-scm.com/",
  },
  {
    name: "Figma",
    description:
      "Figma is a cloud-based design and prototyping tool for creating user interfaces and visual designs. ",
    icon: <FaFigma fontSize="20px" />,
    url: "https://www.figma.com/",
  },
]

export const MotionGrid = motion<GridProps>(Grid)

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
          Favourite Tools
        </Heading>
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
  )
}

export default Tools
