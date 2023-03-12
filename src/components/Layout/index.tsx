import { Container, Flex } from '@chakra-ui/react'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children }) => (
    <Container maxW="container.lg">
        <Flex>
            <Navbar />
            <Container maxW="container.lg" mt={'106px'}>
                {children}
                <Footer />
            </Container>
        </Flex>
    </Container>
)

export default Layout
