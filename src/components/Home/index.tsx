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
            <VStack align="start" w="100%" spacing={1}>
                <SectionHeading textAlign="left" my={2}>
                    Ask me anything about Adam
                </SectionHeading>
                <Paragraph>
                    I&apos;m an AI built on Adam&apos;s career, projects, and
                    takes — ask whatever, I&apos;ll give you a real answer
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
