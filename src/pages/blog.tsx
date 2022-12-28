import { Box, Container, Heading, SlideFade, Divider } from "@chakra-ui/react"
import Message from "../components/Message"

const Blog = () => {
  return (
    <Container maxW="container.lg">
      <SlideFade in={true} offsetY={80}>
        <Box>
          <Heading
            as="h1"
            fontSize={{ base: "28px", md: "32px", lg: "36px" }}
            mb={4}
          >
            Blog
          </Heading>
        </Box>
        <Divider my={10} />
        <Message message="Stay tuned!" type={"empty"} />
      </SlideFade>
    </Container>
  )
}

export default Blog
