import { Container } from "@chakra-ui/react"
import Footer from "./Footer"
import Navbar from "./Navbar"

const Layout = ({ children }) => (
  <Container maxW="container.lg">
    <Navbar />
    {children}
    <Footer />
  </Container>
)

export default Layout
