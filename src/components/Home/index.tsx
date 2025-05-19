import { Divider, Flex, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import Hero from './Hero';

const Timeline = dynamic(() => import('./Timeline'), { ssr: false });
const GitTimeline = dynamic(() => import('./GitTimeline'), { ssr: false });
const Chat = dynamic(() => import('@components/Chat'), { ssr: false });
const Skills = dynamic(() => import('./Skills'), { ssr: false });
const Contact = dynamic(() => import('@components/Contact'), { ssr: false });

function Home() {
    return (
        <VStack
            spacing={8}
            align="center"
            justify="center"
            w="100%"
            divider={<Divider />}
        >
            <Hero />
            <Chat />
            <Skills />
            <Flex justifyContent="center">
                <GitTimeline />
                <Timeline />
            </Flex>
            <section id="contact">
                <Contact />
            </section>
        </VStack>
    );
}

export default Home;
