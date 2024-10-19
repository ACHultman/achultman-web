import { Divider, Flex } from '@chakra-ui/react';

import Hero from './Hero';
import Timeline from './Timeline';
import GitTimeline from './GitTimeline';
import Chat from '@components/Chat';

import Skills from './Skills';
import Contact from '@components/Contact';

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
