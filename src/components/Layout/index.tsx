import { Container, Flex } from '@chakra-ui/react';
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
        <Container maxW="container.lg" className={robotoMono.className} px={0}>
            <Flex>
                <Navbar />
                <div>
                    <Container as="main" maxW="container.lg" mt="106px">
                        {children}
                    </Container>
                    <Footer />
                </div>
            </Flex>
        </Container>
    );
}

export default Layout;
