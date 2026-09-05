import { Box, Container, Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Fraunces, Manrope } from 'next/font/google';
import { PropsWithChildren } from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

const manrope = Manrope({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
});

const fraunces = Fraunces({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-display',
});

function Layout({ children }: PropsWithChildren) {
    return (
        <Box
            className={`site-shell ${manrope.variable} ${fraunces.variable}`}
            minH="100dvh"
        >
            <ChakraLink className="skip-link" href="#main">
                Skip to content
            </ChakraLink>
            <Flex alignItems="center" flexDirection="column" minH="100dvh">
                <Navbar />
                <Container
                    id="main"
                    as="main"
                    maxW="container.xl"
                    px={0}
                    flex="1"
                >
                    {children}
                </Container>
                <Footer />
            </Flex>
        </Box>
    );
}

export default Layout;
