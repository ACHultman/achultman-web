import { Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

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

function ChatIntro() {
    return (
        <VStack align="start" w="100%" spacing={1}>
            <SectionHeading textAlign="left" my={2}>
                Ask me anything about Adam
            </SectionHeading>
            <Paragraph color="subtle">
                I&apos;m an AI trained on Adam&apos;s career, projects, and
                opinions. Recruiters, engineers, managers — I&apos;ve got
                answers.
            </Paragraph>
        </VStack>
    );
}

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
            <ChatIntro />
            <Chat />
            <Flex justify="center" w="100%" py={2}>
                <Link href="#contact">
                    <Button
                        variant="ghost"
                        colorScheme="green"
                        rightIcon={<FaArrowRight />}
                        size="sm"
                    >
                        Want to talk to the real Adam?
                    </Button>
                </Link>
            </Flex>
            <FeaturedWork />
            <Flex
                direction="column"
                align="center"
                w="100%"
                py={2}
                gap={1}
            >
                <Text fontSize="sm" color="gray.500">
                    Interested in working together?
                </Text>
                <Link href="#contact">
                    <Button
                        variant="outline"
                        colorScheme="green"
                        rightIcon={<FaArrowRight />}
                        size="sm"
                    >
                        Get in touch
                    </Button>
                </Link>
            </Flex>
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
