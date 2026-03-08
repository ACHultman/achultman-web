import { useState, useEffect, useRef } from 'react';
import { NextSeo } from 'next-seo';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  SlideFade,
  Divider,
  Flex,
  IconButton,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,

} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

import Paragraph from '@components/Paragraph';

const MotionBox = motion(Box);


interface AgentNode {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  x: number;
  y: number;
}

interface Message {
  from: string;
  to: string;
  label: string;
  delay: number;
}

const AGENTS: AgentNode[] = [
  { id: 'milo', name: 'Milo', emoji: '🧠', role: 'Strategy & Coordination', color: 'blue', x: 50, y: 15 },
  { id: 'scout', name: 'Scout', emoji: '🔭', role: 'Research & Analysis', color: 'orange', x: 15, y: 65 },
  { id: 'dev', name: 'Dev', emoji: '🔧', role: 'Engineering & CI', color: 'green', x: 50, y: 65 },
  { id: 'claw', name: 'Claw', emoji: '🐾', role: 'Ops & Daily Brief', color: 'purple', x: 85, y: 65 },
];

const MESSAGES: Message[] = [
  { from: 'milo', to: 'scout', label: 'Research supplement interactions', delay: 0 },
  { from: 'milo', to: 'dev', label: 'Scaffold labs page', delay: 0.5 },
  { from: 'milo', to: 'claw', label: 'Morning briefing', delay: 1.0 },
  { from: 'scout', to: 'milo', label: '74 supplements analyzed', delay: 2.5 },
  { from: 'dev', to: 'milo', label: 'PR #80 ready for review', delay: 3.0 },
  { from: 'milo', to: 'dev', label: 'Build interactive experiments', delay: 4.0 },
  { from: 'scout', to: 'dev', label: 'Research notes ready', delay: 4.5 },
  { from: 'dev', to: 'milo', label: '21 files updated, CI green ✓', delay: 6.0 },
  { from: 'claw', to: 'milo', label: 'Status synced to chronicle', delay: 6.5 },
];

const STATS = [
  { label: 'Supplements Analyzed', value: '74' },
  { label: 'Files Updated', value: '21' },
  { label: 'Agents Active', value: '4' },
  { label: 'Sprint Duration', value: '1 day' },
];

function AgentCard({
  agent,
  isActive,
  activeMessage,
}: {
  agent: AgentNode;
  isActive: boolean;
  activeMessage: string | null;
}) {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const activeBorder = `${agent.color}.400`;

  return (
    <MotionBox
      animate={{
        scale: isActive ? 1.05 : 1,
        borderColor: isActive ? `var(--chakra-colors-${agent.color}-400)` : undefined,
      }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderWidth="2px"
      borderColor={isActive ? activeBorder : borderColor}
      borderRadius="xl"
      p={4}
      textAlign="center"
      position="relative"
      overflow="visible"
      boxShadow={isActive ? `0 0 20px var(--chakra-colors-${agent.color}-200)` : 'none'}
    >
      {isActive && (
        <MotionBox
          position="absolute"
          top="-2px"
          left="-2px"
          right="-2px"
          bottom="-2px"
          borderRadius="xl"
          borderWidth="2px"
          borderColor={activeBorder}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          pointerEvents="none"
        />
      )}
      <Text fontSize="2xl" mb={1}>{agent.emoji}</Text>
      <Text fontWeight="bold" fontSize="sm">{agent.name}</Text>
      <Text fontSize="xs" color="gray.500">{agent.role}</Text>
      {activeMessage && (
        <MotionBox
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          mt={2}
        >
          <Badge
            colorScheme={agent.color}
            variant="subtle"
            fontSize="xs"
            px={2}
            py={0.5}
            borderRadius="full"
            maxW="100%"
          >
            <Text isTruncated fontSize="xs">{activeMessage}</Text>
          </Badge>
        </MotionBox>
      )}
    </MotionBox>
  );
}

function MessageLine({
  message,
  isActive,
}: {
  message: Message;
  isActive: boolean;
}) {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const activeBg = useColorModeValue('green.50', 'green.900');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const dimText = useColorModeValue('gray.500', 'gray.400');

  const fromAgent = AGENTS.find((a) => a.id === message.from)!;
  const toAgent = AGENTS.find((a) => a.id === message.to)!;

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0.4, x: 0 }}
      transition={{ duration: 0.3 }}
      bg={isActive ? activeBg : bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      px={4}
      py={2}
    >
      <Flex align="center" gap={2} fontSize="sm">
        <Text>{fromAgent.emoji}</Text>
        <Text fontWeight="bold" fontSize="xs">{fromAgent.name}</Text>
        <Text color={dimText} fontSize="xs">→</Text>
        <Text>{toAgent.emoji}</Text>
        <Text fontWeight="bold" fontSize="xs">{toAgent.name}</Text>
        <Text color={dimText} fontSize="xs" flex={1} isTruncated>
          {message.label}
        </Text>
      </Flex>
    </MotionBox>
  );
}

function AgentFlow() {
  const [activeMessageIndex, setActiveMessageIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.500', 'gray.400');
  const statBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      setActiveMessageIndex((prev) => {
        if (prev >= MESSAGES.length - 1) {
          return -1; // Loop
        }
        return prev + 1;
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const currentMessage = activeMessageIndex >= 0 ? MESSAGES[activeMessageIndex] : null;

  const getAgentMessage = (agentId: string): string | null => {
    if (!currentMessage) return null;
    if (currentMessage.from === agentId) return `→ ${currentMessage.label}`;
    if (currentMessage.to === agentId) return `← ${currentMessage.label}`;
    return null;
  };

  const isAgentActive = (agentId: string): boolean => {
    if (!currentMessage) return false;
    return currentMessage.from === agentId || currentMessage.to === agentId;
  };

  return (
    <>
      <NextSeo
        title="Multi-Agent Workflow Visualizer | Labs | Adam Hultman"
        description="Watch 4 AI agents coordinate in real time — strategy, research, engineering, and ops working in parallel."
        canonical="https://hultman.dev/labs/agent-flow"
      />
      <Container maxW="container.md">
        <SlideFade in={true} offsetY={80}>
          <Box>
            <HStack mb={6}>
              <IconButton
                as={NextLink}
                href="/labs"
                aria-label="Back to Labs"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                Systems Visualization
              </Badge>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '32px', lg: '36px' }}
              mb={3}
            >
              🤖 Multi-Agent Workflow
            </Heading>
            <Paragraph fontSize="lg" mb={8}>
              Watch how 4 AI agents coordinate to ship a feature — from research
              to code to deployment. Real workflow data from building this very labs page.
            </Paragraph>

            {/* Stats bar */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
              {STATS.map((stat, i) => (
                <MotionBox
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Stat
                    bg={statBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={4}
                    textAlign="center"
                  >
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {stat.value}
                    </StatNumber>
                    <StatLabel fontSize="xs" color={dimText}>
                      {stat.label}
                    </StatLabel>
                  </Stat>
                </MotionBox>
              ))}
            </SimpleGrid>

            {/* Agent grid */}
            <Box mb={8}>
              <Flex justify="center" mb={4}>
                <AgentCard
                  agent={AGENTS[0]!}
                  isActive={isAgentActive('milo')}
                  activeMessage={getAgentMessage('milo')}
                />
              </Flex>

              {/* Connection lines visual hint */}
              <Flex justify="center" mb={2}>
                <Box
                  w="2px"
                  h="20px"
                  bgGradient="linear(to-b, blue.400, transparent)"
                />
              </Flex>
              <Flex justify="center" mb={2}>
                <Box
                  w={{ base: '80%', md: '60%' }}
                  h="2px"
                  bgGradient="linear(to-r, orange.400, green.400, purple.400)"
                />
              </Flex>
              <Flex justify="center" gap={2} mb={4}>
                <Box w="2px" h="20px" bgGradient="linear(to-b, transparent, orange.400)" />
                <Box flex={1} />
                <Box w="2px" h="20px" bgGradient="linear(to-b, transparent, green.400)" />
                <Box flex={1} />
                <Box w="2px" h="20px" bgGradient="linear(to-b, transparent, purple.400)" />
              </Flex>

              <SimpleGrid columns={3} spacing={3}>
                {AGENTS.slice(1).map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isActive={isAgentActive(agent.id)}
                    activeMessage={getAgentMessage(agent.id)}
                  />
                ))}
              </SimpleGrid>
            </Box>

            {/* Message log */}
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={{ base: 4, md: 6 }}
              mb={8}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={dimText}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Message Log
                </Text>
                <Badge
                  as="button"
                  cursor="pointer"
                  colorScheme={isPlaying ? 'green' : 'gray'}
                  variant="subtle"
                  fontSize="xs"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </Badge>
              </Flex>
              <VStack spacing={2} align="stretch">
                {MESSAGES.map((msg, i) => (
                  <MessageLine
                    key={i}
                    message={msg}
                    isActive={i === activeMessageIndex}
                  />
                ))}
              </VStack>
            </Box>

            <Divider my={8} />

            <Box mb={8}>
              <Heading as="h2" size="sm" mb={3}>
                How it works
              </Heading>
              <Text fontSize="sm" color={dimText} mb={3}>
                This visualization shows the real coordination pattern used to build the
                labs page you&apos;re looking at right now. Four AI agents running on{' '}
                <Link href="https://github.com/ACHultman/OpenClaw" isExternal color="blue.400">
                  OpenClaw
                </Link>{' '}
                — an open-source agent orchestration platform — work in parallel:
              </Text>
              <VStack align="stretch" spacing={2} mb={3} pl={4}>
                <Text fontSize="sm" color={dimText}>
                  🧠 <strong>Milo</strong> — Coordinates the team, writes standups, delegates tasks
                </Text>
                <Text fontSize="sm" color={dimText}>
                  🔭 <strong>Scout</strong> — Researches opportunities, analyzes competitors, evolves ideas
                </Text>
                <Text fontSize="sm" color={dimText}>
                  🔧 <strong>Dev</strong> — Handles CI, PRs, code review, architecture, and implementation
                </Text>
                <Text fontSize="sm" color={dimText}>
                  🐾 <strong>Claw</strong> — Daily briefings, personal ops, chronicles everything
                </Text>
              </VStack>
              <Text fontSize="sm" color={dimText} mb={3}>
                Each agent has its own workspace, notes, and tools — but they share context
                through a common status file and can spawn sub-agents for parallel work.
                The result: a full feature shipped in a single sprint by a team of AI agents.
              </Text>
              <HStack spacing={4} fontSize="xs" color={dimText}>
                <Text>Built with: Next.js · Chakra UI · Framer Motion</Text>
                <Link
                  href="https://github.com/ACHultman/achultman-web"
                  isExternal
                  color="blue.400"
                >
                  View Source →
                </Link>
              </HStack>
            </Box>
          </Box>
        </SlideFade>
      </Container>
    </>
  );
}

export default AgentFlow;
