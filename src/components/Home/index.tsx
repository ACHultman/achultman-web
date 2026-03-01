import { Divider, Flex, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import Hero from './Hero';
import FeaturedWork from './FeaturedWork';
import ChatPlaceholder from '../Chat/ChatPlaceholder';
import SectionHeading from '../SectionHeading';
import Paragraph from '../Paragraph';

const Timeline = dynamic(() => import('./Timeline'), { ssr: false });
const GitTimeline = dynamic(() => import('./GitTimeline'), { ssr: false });

const Chat = dynamic(() => import('@components/Chat'), {
    ssr: false,
    loading: () => <ChatPlaceholder />,
});
const Contact = dynamic(() => import('@components/Contact'));

function Home() {
    return (
        <VStack
            spacing={{ base: 6, md: 10 }}
            align="center"
            justify="center"
            w="100%"
            divider={<Divider />}
        >
            <Hero />
            <FeaturedWork />
            <VStack align="start" w="100%" spacing={2}>
                <SectionHeading textAlign="left" my={2}>
                    Go deeper
                </SectionHeading>
                <Paragraph>
                    Curious about any of this? Ask my AI — it knows my career,
                    stack, and opinions.
                </Paragraph>
            </VStack>
            <Chat />
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
