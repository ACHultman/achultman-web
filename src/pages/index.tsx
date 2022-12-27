import { Container } from "@chakra-ui/react"
import Home from "../components/Home"

const Index = () => (
  <>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <Container maxW="container.lg" mt={["5", "10"]}>
      <Home />
    </Container>
  </>
)

export default Index
