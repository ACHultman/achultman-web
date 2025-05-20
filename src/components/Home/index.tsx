import {
    Divider,
    Flex,
    VStack,
    Box,
    useColorModeValue,
    Skeleton,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import Hero from './Hero';

const Timeline = dynamic(() => import('./Timeline'), { ssr: false });
const GitTimeline = dynamic(() => import('./GitTimeline'), { ssr: false });

const ChatPlaceholder = () => {
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    return (
        <Skeleton
            w="100%"
            minW="300px"
            minHeight="268px"
            borderRadius="30px"
            bg={bgColor}
        />
    );
};

const Chat = dynamic(() => import('@components/Chat'), {
    ssr: false,
    loading: () => <ChatPlaceholder />,
});
const Skills = dynamic(() => import('./Skills'));
const Contact = dynamic(() => import('@components/Contact'));

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
