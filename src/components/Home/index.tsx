import { Divider, Flex } from '@chakra-ui/react';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./Hero'));
const Timeline = dynamic(() => import('./Timeline'));
const GitTimeline = dynamic(() => import('./GitTimeline'));
const Chat = dynamic(() => import('@components/Chat'), { ssr: false });
const Skills = dynamic(() => import('./Skills'));
const Contact = dynamic(() => import('@components/Contact'));

function Home() {
    return (
        <>
            <Hero />
            <Divider my={10} />
            <Chat />
            <Divider my={10} />
            <Skills />
            <Divider my={10} />
            <Flex justifyContent="center">
                <GitTimeline />
                <Timeline />
            </Flex>
            <Divider my={10} />
            <section id="contact">
                <Contact />
            </section>
        </>
    );
}

export default Home;
