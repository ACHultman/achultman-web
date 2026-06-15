import { Container, Flex, Link } from '@chakra-ui/react';
import { Roboto_Mono } from 'next/font/google';
import { PropsWithChildren } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
});

function Layout({ children }: PropsWithChildren) {
    return (
        <Container maxW="container.xl" className={robotoMono.className} px={0}>
            <Link
                href="#main"
                position="absolute"
                left="-9999px"
                _focus={{
                    left: '50%',
                    top: '8px',
                    transform: 'translateX(-50%)',
                    zIndex: 'skipLink',
                    px: 4,
                    py: 2,
                    bg: 'green.600',
                    color: 'white',
                    borderRadius: 'md',
                }}
            >
                Skip to content
            </Link>
            <Flex alignItems="center" flexDirection="column">
                <Navbar />
                <Container
                    as="main"
                    id="main"
                    maxW="container.xl"
                    mt={{ base: '80px', md: '106px' }}
                >
                    {children}
                </Container>
                <Footer />
            </Flex>
        </Container>
    );
}

export default Layout;
