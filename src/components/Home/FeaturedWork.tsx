import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    SimpleGrid,
    Tag,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface Project {
    title: string;
    context: string;
    description: string;
    tags: string[];
    href?: string;
}

const PROJECTS: Project[] = [
    {
        title: 'Geny',
        context: 'Assembly Digital',
        description:
            'LLM-powered content generator deployed at the edge inside WordPress — used by major Canadian media clients to accelerate editorial workflows at scale.',
        tags: ['TypeScript', 'AWS Lambda', 'OpenAI'],
    },
    {
        title: 'Wanderlust',
        context: 'Open source',
        description:
            'OpenAI Assistants API demo rebuilt in Next.js. Became the foundation for 10+ internal and side projects. 59 stars on GitHub.',
        tags: ['Next.js', 'TypeScript', 'OpenAI Assistants'],
        href: 'https://github.com/ACHultman/wanderlust',
    },
    {
        title: 'Kopperfield Platform',
        context: 'Kopperfield · Current',
        description:
            'Full-stack features for a SaaS platform helping homeowners electrify their homes — from initial quote to installation.',
        tags: ['React', 'Node.js', 'PostgreSQL'],
    },
];

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const card = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function ProjectCard({ project }: { project: Project }) {
    const bg = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('gray.200', 'gray.700');
    const subtle = useColorModeValue('gray.500', 'gray.400');

    return (
        <motion.div variants={card} style={{ height: '100%' }}>
            <Box
                bg={bg}
                borderWidth="1px"
                borderColor={border}
                borderRadius="xl"
                p={6}
                h="100%"
                display="flex"
                flexDirection="column"
                transition="box-shadow 0.2s"
                _hover={{ boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
            >
                <Flex justify="space-between" align="flex-start" mb={1}>
                    <Heading as="h3" size="md">
                        {project.title}
                    </Heading>
                    {project.href && (
                        <IconButton
                            as="a"
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title}`}
                            icon={<FaExternalLinkAlt />}
                            size="xs"
                            variant="ghost"
                            colorScheme="green"
                        />
                    )}
                </Flex>
                <Text fontSize="xs" color={subtle} mb={4}>
                    {project.context}
                </Text>
                <Text fontSize="sm" lineHeight={1.7} flex="1" mb={5}>
                    {project.description}
                </Text>
                <HStack spacing={2} wrap="wrap">
                    {project.tags.map((tag) => (
                        <Tag key={tag} size="sm" colorScheme="green" variant="subtle">
                            {tag}
                        </Tag>
                    ))}
                </HStack>
            </Box>
        </motion.div>
    );
}

function FeaturedWork() {
    return (
        <VStack align="start" w="100%" spacing={6}>
            <Heading as="h2" size="lg">
                Featured Work
            </Heading>
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ width: '100%' }}
            >
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                    {PROJECTS.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </SimpleGrid>
            </motion.div>
        </VStack>
    );
}

export default FeaturedWork;
