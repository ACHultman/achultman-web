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
import styled from '@emotion/styled';
import Contact from '@components/Contact';

const P = styled(Paragraph)`
    line-height: 1.6;
    width: 100%;
    font-size: var(--chakra-fontSizes-lg);

    @media (min-width: 768px) {
        font-size: var(--chakra-fontSizes-xl);
    }

    mark {
        white-space: pre-wrap;
    }
`;

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
                            <VStack gap={8} w="100%">
                                <P>
                                    <Highlight
                                        query={[
                                            'Full-stack software developer',
                                            '5+ years',
                                            'AI-enabled',
                                            'secure',
                                            'scalable platforms',
                                            'Cybersecurity & Privacy',
                                        ]}
                                        styles={{ color: 'green.500' }}
                                    >
                                        I am a Full-stack software developer
                                        (EIT) with 5+ years of professional
                                        experience building AI-enabled, secure,
                                        and scalable platforms. I hold a
                                        Bachelor of Software Engineering with a
                                        specialization in Cybersecurity &
                                        Privacy from the University of Victoria.
                                    </Highlight>
                                </P>
                                <P>
                                    <Highlight
                                        query={[
                                            'high-traffic web applications',
                                            'distributed systems',
                                            'performance',
                                            'security',
                                            'user experience',
                                            'platform architecture',
                                            'edge computing',
                                            'collaborator',
                                        ]}
                                        styles={{ color: 'green.500' }}
                                    >
                                        I have a proven track record delivering
                                        high-traffic web applications and
                                        distributed systems optimized for
                                        performance, security, and user
                                        experience. As a strong collaborator, I
                                        bring deep expertise in platform
                                        architecture, edge computing, and
                                        cybersecurity to every project.
                                    </Highlight>
                                </P>

                                <P>
                                    <Highlight
                                        query={[
                                            'VikeLabs',
                                            'VikeSec',
                                            'hosted a React testing workshop',
                                            'Capture The Flag (CTF)',
                                            'cybersecurity',
                                            'analytical skills',
                                        ]}
                                        styles={{
                                            color: 'green.500',
                                        }}
                                    >
                                        At UVic, I actively engaged in
                                        student-led initiatives like VikeLabs
                                        and VikeSec. With VikeLabs, I hosted a
                                        React testing workshop and helped
                                        develop a degree planner web app for
                                        students. At VikeSec, I participated in
                                        Capture The Flag (CTF) competitions,
                                        which ignited my passion for
                                        cybersecurity and sharpened my
                                        analytical skills.
                                    </Highlight>
                                </P>
                                <P>
                                    <Highlight
                                        query={[
                                            'side projects',
                                            'playing piano',
                                            'new hiking trails',
                                            'learn',
                                            'adapt',
                                            'grow',
                                        ]}
                                        styles={{
                                            color: 'green.500',
                                        }}
                                    >
                                        Beyond my professional pursuits, I enjoy
                                        diving into side projects, playing
                                        piano, and exploring new hiking trails.
                                        I’m always eager to learn, adapt, and
                                        grow, bringing curiosity and enthusiasm
                                        to every team and project I join.
                                    </Highlight>
                                </P>
                            </VStack>
                            <VStack w="100%" gap={8}>
                                <P>
                                    Thanks for making it this far! Feel free to
                                    connect with me on LinkedIn or drop me a
                                    message using the form below. I’d love to
                                    hear from you!
                                </P>
                                <Contact />
                            </VStack>
                        </VStack>
                    </Box>
                </SlideFade>
            </Container>
        </>
    );
}

export default About;
