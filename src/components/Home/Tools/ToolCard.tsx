import {
  Box,
  Heading,
  IconButton,
  LinkOverlay,
  LinkBox,
  useColorModeValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"

import Paragraph from "../../Paragraph"

export interface ToolCardProps {
  tool: {
    name: string
    description: string
    url: string
    icon: JSX.Element
  }
}

const MotionIconButton = motion(IconButton)

const ToolCard = ({ tool }: ToolCardProps) => {
  if (!tool) {
    return
  }

  return (
    <LinkBox as="article">
      <Box
        w="100%"
        p={4}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        borderRadius={5}
        borderWidth="1px"
        transition=".5s"
        cursor="pointer"
        display="flex"
        role="group"
        _hover={{
          borderColor: "green.500",
        }}
      >
        <MotionIconButton
          as="a"
          href={tool.url}
          rel="noopener"
          target="_blank"
          aria-label={tool.name}
          mr={3}
          _groupHover={{ color: "green.500" }}
          icon={tool.icon}
          whileHover={{ scale: 1.1 }}
        />
        <Box>
          <LinkOverlay href={tool.url} rel="noopener" isExternal>
            <Heading as="h2" size="sm">
              {tool.name}
            </Heading>
            <Paragraph mt={1} fontSize="sm">
              {tool.description}
            </Paragraph>
          </LinkOverlay>
        </Box>
      </Box>
    </LinkBox>
  )
}

export default ToolCard
