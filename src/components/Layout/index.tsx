import { Box, Link as ChakraLink } from '@chakra-ui/react';
import { Geist, Source_Serif_4 } from 'next/font/google';
import { PropsWithChildren } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const geist = Geist({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
});
const serif = Source_Serif_4({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-editorial',
    weight: ['400'],
    style: ['normal'],
});

export default function Layout({ children }: PropsWithChildren) {
    return (
        <Box
            className={`site-shell ${geist.variable} ${serif.variable}`}
            minH="100dvh"
        >
            <ChakraLink className="skip-link" href="#main">
                Skip to content
            </ChakraLink>
            <Navbar />
            <Box id="main" as="main" tabIndex={-1} flex="1" w="100%">
                {children}
            </Box>
            <Footer />
        </Box>
    );
}
