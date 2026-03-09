import { NextSeo } from 'next-seo';
import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  SlideFade,
  Text,
  useColorModeValue,
  Flex,
  Divider,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

import Paragraph from '@components/Paragraph';

const MotionBox = motion(Box);

interface Experiment {
  title: string;
  emoji: string;
  description: string;
  status: 'Live' | 'In Progress' | 'Experiment';
  href: string;
  isExternal?: boolean;
  colorScheme: string;
  tags: string[];
}

const EXPERIMENTS: Experiment[] = [
  {
    title: 'Interaction Checker',
    emoji: '💊',
    description:
      'Check if your supplements interact with your medications. Evidence-based pharmacological data with risk levels and mechanisms.',
    status: 'Live',
    href: '/labs/interaction-checker',
    colorScheme: 'green',
    tags: ['Health Tech', 'Interactive', 'Data'],
  },
  {
    title: 'Token Probability Visualizer',
    emoji: '🎰',
    description:
      'See how a language model "thinks" — visualize the probability distribution for each generated token in real time.',
    status: 'Live',
    href: '/labs/token-viz',
    colorScheme: 'purple',
    tags: ['AI / ML', 'Visualization', 'LLM'],
  },
  {
    title: 'AI Prompt Duel',
    emoji: '⚔️',
    description:
      'Two AI models, one prompt — you decide which response is better. Blind evaluation inspired by RLHF and Chatbot Arena.',
    status: 'Live',
    href: '/labs/prompt-duel',
    colorScheme: 'red',
    tags: ['AI / ML', 'Interactive', 'RLHF'],
  },
  {
    title: 'Multi-Agent Workflow',
    emoji: '🤖',
    description:
      'Watch 4 AI agents coordinate to ship a feature — from research to code to deployment. Real workflow data.',
    status: 'Live',
    href: '/labs/agent-flow',
    colorScheme: 'blue',
    tags: ['Systems', 'Animation', 'AI'],
  },
  {
    title: 'Evidence Strength Visualizer',
    emoji: '📊',
    description:
      'Interactive bubble chart mapping supplement evidence quality vs. popularity. Click to explore claims vs. actual science.',
    status: 'Live',
    href: '/labs/evidence-viz',
    colorScheme: 'teal',
    tags: ['Health Tech', 'Visualization', 'Data'],
  },
  {
    title: 'BeatMaker',
    emoji: '🎵',
    description:
      'Describe a beat in plain text and hear it come alive. Interactive sequencer with Tone.js synthesis — remix genres from lofi to trap.',
    status: 'Live',
    href: '/labs/beatmaker',
    colorScheme: 'purple',
    tags: ['Audio', 'Interactive', 'Creative'],
  },
  {
    title: 'Evidence Stack',
    emoji: '📚',
    description:
      'Evidence-graded supplement guidance. No affiliate links, no hype — just research.',
    status: 'Live',
    href: 'https://evidence-stack.vercel.app',
    isExternal: true,
    colorScheme: 'teal',
    tags: ['Health Tech', 'Full App', 'AI'],
  },
  {
    title: 'AIA Compliance',
    emoji: '⚖️',
    description:
      'Open-source EU AI Act compliance toolkit for developers and organizations.',
    status: 'In Progress',
    href: 'https://github.com/ACHultman/aia-compliance',
    isExternal: true,
    colorScheme: 'yellow',
    tags: ['AI Policy', 'Open Source'],
  },
  {
    title: 'OpenClaw',
    emoji: '🐾',
    description:
      '4-agent team running strategy, research, engineering, and ops — the system that built this page.',
    status: 'Experiment',
    href: 'https://github.com/ACHultman/OpenClaw',
    isExternal: true,
    colorScheme: 'orange',
    tags: ['Agents', 'Platform', 'Open Source'],
  },
];

const STATUS_COLORS: Record<string, string> = {
  Live: 'green',
  'In Progress': 'yellow',
  Experiment: 'purple',
};

function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const cardHoverBg = useColorModeValue('white', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('gray.100', 'gray.600');

  const isInternal = !experiment.isExternal;

  const CardContent = (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      cursor="pointer"
      position="relative"
      overflow="hidden"
      _hover={{
        bg: cardHoverBg,
        transform: 'translateY(-4px)',
        shadow: 'lg',
        borderColor: `${experiment.colorScheme}.400`,
      }}
      style={{ transition: 'all 0.2s ease' }}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Top accent line */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bgGradient={`linear(to-r, ${experiment.colorScheme}.400, ${experiment.colorScheme}.200)`}
      />

      <Flex justify="space-between" align="start" mb={3} mt={1}>
        <HStack spacing={2}>
          <Text fontSize="xl">{experiment.emoji}</Text>
          <Heading as="h3" size="sm">
            {experiment.title}
          </Heading>
        </HStack>
        <Badge
          colorScheme={STATUS_COLORS[experiment.status]}
          variant="subtle"
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="full"
          flexShrink={0}
        >
          {experiment.status}
        </Badge>
      </Flex>

      <Text fontSize="sm" color={subtleText} mb={4} flex={1}>
        {experiment.description}
      </Text>

      <Flex wrap="wrap" gap={1}>
        {experiment.tags.map((tag) => (
          <Badge
            key={tag}
            bg={tagBg}
            fontSize="xs"
            fontWeight="normal"
            px={2}
            py={0.5}
            borderRadius="full"
          >
            {tag}
          </Badge>
        ))}
      </Flex>

      {isInternal && (
        <Flex
          position="absolute"
          bottom={4}
          right={4}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <Text fontSize="xs" color={`${experiment.colorScheme}.400`} fontWeight="bold">
            Try it →
          </Text>
        </Flex>
      )}
    </MotionBox>
  );

  if (isInternal) {
    return (
      <Box as={NextLink} href={experiment.href} role="group" _hover={{ textDecoration: 'none' }} display="block" h="100%">
        {CardContent}
      </Box>
    );
  }

  return (
    <Box as="a" href={experiment.href} target="_blank" rel="noopener noreferrer" role="group" _hover={{ textDecoration: 'none' }} display="block" h="100%">
      {CardContent}
    </Box>
  );
}

function Labs() {
  const dimText = useColorModeValue('gray.500', 'gray.400');

  return (
    <>
      <NextSeo
        title="Labs"
        description="Interactive experiments in AI, health tech, and developer tools. Try live demos of LLM token probabilities, supplement interaction checking, and multi-agent workflows."
        canonical="https://hultman.dev/labs"
      />
      <Container maxW="container.lg">
        <SlideFade in={true} offsetY={80}>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: '28px', md: '36px', lg: '42px' }}
              mb={3}
            >
              Labs
            </Heading>
            <Paragraph fontSize="lg" mb={2}>
              Interactive experiments in AI, health tech, and developer tools.
            </Paragraph>
            <Text fontSize="sm" color={dimText} mb={10}>
              Each experiment is a live demo you can play with. No login, no install — just click and explore.
            </Text>

            {/* Featured experiments */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={10}>
              {EXPERIMENTS.map((experiment, i) => (
                <ExperimentCard key={experiment.title} experiment={experiment} index={i} />
              ))}
            </SimpleGrid>

            <Divider mb={6} />

            <Flex justify="space-between" align="center" mb={8} fontSize="xs" color={dimText}>
              <Text>
                More experiments coming soon. Built by{' '}
                <Link as={NextLink} href="/" color="green.400">
                  Adam Hultman
                </Link>
                .
              </Text>
              <Link
                href="https://github.com/ACHultman/achultman-web"
                isExternal
                color="green.400"
              >
                View Source →
              </Link>
            </Flex>
          </Box>
        </SlideFade>
      </Container>
    </>
  );
}

export default Labs;
