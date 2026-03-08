import { NextSeo } from 'next-seo';
import {
    Badge,
    Box,
    Container,
    Heading,
    HStack,
    LinkBox,
    LinkOverlay,
    SimpleGrid,
    SlideFade,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import Paragraph from '@components/Paragraph';

interface Project {
    title: string;
    description: string;
    status: 'Live' | 'In Progress' | 'Experiment';
    href: string;
}

const PROJECTS: Project[] = [
    {
        title: 'Evidence Stack',
        description:
            'Evidence-graded supplement guidance. No affiliate links.',
        status: 'Live',
        href: 'https://evidence-stack.vercel.app',
    },
    {
        title: 'AIA Compliance',
        description: 'Open-source EU AI Act compliance toolkit.',
        status: 'In Progress',
        href: 'https://github.com/ACHultman/aia-compliance',
    },
    {
        title: 'Multi-Agent Coordination',
        description:
            '4-agent team running on OpenClaw. Strategy, research, engineering, ops.',
        status: 'Experiment',
        href: '#',
    },
];

const STATUS_COLORS: Record<Project['status'], string> = {
    Live: 'green',
    'In Progress': 'yellow',
    Experiment: 'purple',
};

function Labs() {
    const cardBg = useColorModeValue('gray.50', 'gray.700');
    const cardHoverBg = useColorModeValue('gray.100', 'gray.600');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const subtleText = useColorModeValue('gray.600', 'gray.400');

    return (
        <>
            <NextSeo
                title="Labs | Adam Hultman"
                description="Small projects, prototypes, and experiments in AI, health tech, and developer tools."
                canonical="https://hultman.dev/labs"
            />
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{
                                base: '28px',
                                md: '32px',
                                lg: '36px',
                            }}
                            mb={4}
                        >
                            Labs
                        </Heading>
                        <Paragraph fontSize="lg" mb={10}>
                            Small projects, prototypes, and experiments in AI,
                            health tech, and developer tools.
                        </Paragraph>

                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={6}
                        >
                            {PROJECTS.map((project) => (
                                <LinkBox
                                    key={project.title}
                                    as="article"
                                    bg={cardBg}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    borderRadius="lg"
                                    p={6}
                                    transition="all 0.2s"
                                    _hover={{
                                        bg: cardHoverBg,
                                        transform: 'translateY(-2px)',
                                        shadow: 'md',
                                    }}
                                >
                                    <HStack
                                        justify="space-between"
                                        align="start"
                                        mb={3}
                                    >
                                        <Heading as="h3" size="md">
                                            <LinkOverlay
                                                href={project.href}
                                                isExternal={
                                                    project.href !== '#'
                                                }
                                            >
                                                {project.title}
                                            </LinkOverlay>
                                        </Heading>
                                        {project.href !== '#' && (
                                            <ExternalLinkIcon
                                                mt={1}
                                                color="gray.400"
                                            />
                                        )}
                                    </HStack>
                                    <Text
                                        fontSize="sm"
                                        color={subtleText}
                                        mb={4}
                                    >
                                        {project.description}
                                    </Text>
                                    <Badge
                                        colorScheme={
                                            STATUS_COLORS[project.status]
                                        }
                                        variant="subtle"
                                        fontSize="xs"
                                        px={2}
                                        py={0.5}
                                        borderRadius="full"
                                    >
                                        {project.status}
                                    </Badge>
                                </LinkBox>
                            ))}
                        </SimpleGrid>
                    </Box>
                </SlideFade>
            </Container>
        </>
    );
}

export default Labs;
