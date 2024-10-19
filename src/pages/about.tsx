import Head from 'next/head';
import {
    Box,
    Container,
    Heading,
    SlideFade,
    Highlight,
    VStack,
} from '@chakra-ui/react';

import Paragraph from '@components/Paragraph';
import Chat from '@components/Chat';

function About() {
    return (
        <>
            <Head>
                <title>Adam Hultman | About</title>
            </Head>
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                            mb={4}
                        >
                            About Me
                        </Heading>
                        <VStack gap={8}>
                            <VStack gap={8}>
                                <Paragraph fontSize="xl" lineHeight={1.6}>
                                    <Highlight
                                        query={[
                                            'Bachelor of Software Engineering',
                                            'cross-platform software development',
                                            'cybersecurity',
                                            'artificial intelligence',
                                        ]}
                                        styles={{
                                            color: 'green.500',
                                        }}
                                    >
                                        I hold a Bachelor of Software
                                        Engineering degree from the University
                                        of Victoria, where I developed a deep
                                        passion for cross-platform software
                                        development, cybersecurity, and
                                        artificial intelligence. I thrive on
                                        exploring and innovating with new
                                        technologies, always looking for ways to
                                        build better, more efficient solutions.
                                    </Highlight>
                                </Paragraph>
                                <Paragraph fontSize="xl" lineHeight={1.6}>
                                    <Highlight
                                        query={[
                                            'full-stack',
                                            'front-end',
                                            'robust, user-centric software',
                                            'collaboration',
                                            'problem-solving',
                                            'adapting to diverse technical challenges',
                                        ]}
                                        styles={{
                                            color: 'green.500',
                                        }}
                                    >
                                        Professionally, I've gained experience
                                        in various full-stack and front-end
                                        roles, where I've honed my ability to
                                        deliver robust, user-centric software.
                                        These roles have helped me sharpen my
                                        skills in collaboration,
                                        problem-solving, and adapting to diverse
                                        technical challenges.
                                    </Highlight>
                                </Paragraph>
                                <Paragraph fontSize="xl" lineHeight={1.6}>
                                    <Highlight
                                        query={[
                                            'VikeLabs',
                                            'VikeSec',
                                            'hosted a React testing workshop',
                                            'Capture The Flag (CTF)',
                                            'problem-solving skills',
                                        ]}
                                        styles={{
                                            color: 'green.500',
                                        }}
                                    >
                                        During my time at UVic, I actively
                                        participated in student-led initiatives
                                        like VikeLabs and VikeSec. At VikeLabs,
                                        I hosted a React testing workshop and
                                        contributed to building a degree planner
                                        web application for UVic students. With
                                        VikeSec, I participated in Capture The
                                        Flag (CTF) competitions, which fueled my
                                        interest in cybersecurity and sharpened
                                        my problem-solving skills.
                                    </Highlight>
                                </Paragraph>
                                <Paragraph fontSize="xl" lineHeight={1.6}>
                                    In my free time, I enjoy working on side
                                    projects, playing guitar, and hiking. I’m
                                    always eager to learn, adapt, and
                                    grow—qualities that I bring to every team
                                    and project I’m a part of.
                                </Paragraph>
                            </VStack>
                            <VStack w="100%" p={4}>
                                <Paragraph fontSize="xl" lineHeight={1.6}>
                                    If you've read this far, feel free to ask
                                    some questions!
                                </Paragraph>
                                <Chat />
                            </VStack>
                        </VStack>
                    </Box>
                </SlideFade>
            </Container>
        </>
    );
}

export default About;
