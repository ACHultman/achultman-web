import { useState, useRef, useEffect, useCallback } from 'react';
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
  Button,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import Paragraph from '@components/Paragraph';
import {
  createInitialState,
  stepRaft,
  killNode,
  reviveNode,
  addPartition,
  removePartition,
  clientRequest,
  createGossipState,
  stepGossip,
  updateGossipNode,
  type RaftState,
  type RaftNode,
  type GossipState,
  type GossipNode as GossipNodeType,
  type NodeState,
} from '@data/distributedData';

const NODE_COLORS: Record<NodeState, string> = {
  follower: '#A0AEC0',
  candidate: '#ECC94B',
  leader: '#48BB78',
  dead: '#FC8181',
};

const MESSAGE_COLORS: Record<string, string> = {
  RequestVote: '#ECC94B',
  VoteGranted: '#48BB78',
  VoteDenied: '#FC8181',
  AppendEntries: '#63B3ED',
  AppendResponse: '#B794F4',
};

export default function DistributedPage() {
  // ─── Raft State ──────────────────────────────────────────────
  const [raftState, setRaftState] = useState<RaftState>(() =>
    createInitialState(5),
  );
  const [raftPlaying, setRaftPlaying] = useState(false);
  const [raftSpeed, setRaftSpeed] = useState(500);
  const [selectedRaftNode, setSelectedRaftNode] = useState<number | null>(null);
  const [partitionMode, setPartitionMode] = useState(false);
  const [partitionFirst, setPartitionFirst] = useState<number | null>(null);
  const [clientValue, setClientValue] = useState('');
  const raftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // logEndRef removed — no auto-scroll

  // ─── Gossip State ────────────────────────────────────────────
  const [gossipState, setGossipState] = useState<GossipState>(() =>
    createGossipState(6),
  );
  const [gossipPlaying, setGossipPlaying] = useState(false);
  const [gossipSpeed, setGossipSpeed] = useState(500);
  const [selectedGossipNode, setSelectedGossipNode] = useState<number | null>(
    null,
  );
  const [gossipKey, setGossipKey] = useState('status');
  const [gossipValue, setGossipValue] = useState('online');
  const gossipIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Theme ───────────────────────────────────────────────────
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const svgBg = useColorModeValue('#F7FAFC', '#2D3748');
  const textFill = useColorModeValue('#1A202C', '#E2E8F0');
  const logBg = useColorModeValue('gray.100', 'gray.800');

  // ─── Raft Controls ──────────────────────────────────────────
  const stepRaftOnce = useCallback(() => {
    setRaftState((s) => stepRaft(s));
  }, []);

  useEffect(() => {
    if (raftPlaying) {
      raftIntervalRef.current = setInterval(() => {
        setRaftState((s) => stepRaft(s));
      }, raftSpeed);
    } else if (raftIntervalRef.current) {
      clearInterval(raftIntervalRef.current);
      raftIntervalRef.current = null;
    }
    return () => {
      if (raftIntervalRef.current) clearInterval(raftIntervalRef.current);
    };
  }, [raftPlaying, raftSpeed]);

  // No auto-scroll — let the user control the log position

  const handleRaftNodeClick = (nodeId: number) => {
    if (partitionMode) {
      if (partitionFirst === null) {
        setPartitionFirst(nodeId);
      } else {
        if (partitionFirst !== nodeId) {
          // Toggle partition
          const exists = raftState.partitions.some(
            ([a, b]) =>
              (a === partitionFirst && b === nodeId) ||
              (a === nodeId && b === partitionFirst),
          );
          if (exists) {
            setRaftState((s) => removePartition(s, partitionFirst!, nodeId));
          } else {
            setRaftState((s) => addPartition(s, partitionFirst!, nodeId));
          }
        }
        setPartitionFirst(null);
        setPartitionMode(false);
      }
    } else {
      setSelectedRaftNode((prev) => (prev === nodeId ? null : nodeId));
    }
  };

  const handleKillRevive = (nodeId: number) => {
    const node = raftState.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    if (node.state === 'dead') {
      setRaftState((s) => reviveNode(s, nodeId));
    } else {
      setRaftState((s) => killNode(s, nodeId));
    }
  };

  const handleClientRequest = () => {
    if (!clientValue.trim()) return;
    setRaftState((s) => clientRequest(s, clientValue.trim()));
    setClientValue('');
  };

  const resetRaft = () => {
    setRaftPlaying(false);
    setRaftState(createInitialState(5));
    setSelectedRaftNode(null);
    setPartitionMode(false);
    setPartitionFirst(null);
  };

  // ─── Gossip Controls ────────────────────────────────────────
  useEffect(() => {
    if (gossipPlaying) {
      gossipIntervalRef.current = setInterval(() => {
        setGossipState((s) => stepGossip(s));
      }, gossipSpeed);
    } else if (gossipIntervalRef.current) {
      clearInterval(gossipIntervalRef.current);
      gossipIntervalRef.current = null;
    }
    return () => {
      if (gossipIntervalRef.current) clearInterval(gossipIntervalRef.current);
    };
  }, [gossipPlaying, gossipSpeed]);

  const handleGossipNodeClick = (nodeId: number) => {
    setSelectedGossipNode((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleGossipUpdate = () => {
    if (selectedGossipNode === null || !gossipKey.trim()) return;
    setGossipState((s) =>
      updateGossipNode(s, selectedGossipNode, gossipKey.trim(), gossipValue),
    );
  };

  const resetGossip = () => {
    setGossipPlaying(false);
    setGossipState(createGossipState(6));
    setSelectedGossipNode(null);
  };

  // ─── Raft SVG Rendering ─────────────────────────────────────
  const renderRaftSVG = () => {
    const { nodes, messages, partitions } = raftState;

    return (
      <svg
        viewBox="0 0 500 400"
        width="100%"
        style={{ maxWidth: 500, background: svgBg, borderRadius: 12 }}
      >
        {/* Partition lines */}
        {partitions.map(([a, b], i) => {
          const nodeA = nodes.find((n) => n.id === a);
          const nodeB = nodes.find((n) => n.id === b);
          if (!nodeA || !nodeB) return null;
          return (
            <line
              key={`p-${i}`}
              x1={nodeA.x}
              y1={nodeA.y}
              x2={nodeB.x}
              y2={nodeB.y}
              stroke="#FC8181"
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.6}
            />
          );
        })}

        {/* Messages in flight */}
        {messages.map((msg, i) => {
          const fromNode = nodes.find((n) => n.id === msg.from);
          const toNode = nodes.find((n) => n.id === msg.to);
          if (!fromNode || !toNode) return null;
          const x =
            fromNode.x + (toNode.x - fromNode.x) * Math.min(msg.progress, 1);
          const y =
            fromNode.y + (toNode.y - fromNode.y) * Math.min(msg.progress, 1);
          return (
            <circle
              key={`msg-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill={MESSAGE_COLORS[msg.type] ?? '#CBD5E0'}
              opacity={0.9}
            >
              <title>
                {msg.type} (term {msg.term})
              </title>
            </circle>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            onClick={() => handleRaftNodeClick(node.id)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={30}
              fill={NODE_COLORS[node.state]}
              opacity={node.state === 'dead' ? 0.3 : 0.9}
              stroke={
                selectedRaftNode === node.id
                  ? '#3182CE'
                  : partitionFirst === node.id
                    ? '#E53E3E'
                    : 'transparent'
              }
              strokeWidth={3}
            />
            <text
              x={node.x}
              y={node.y - 6}
              textAnchor="middle"
              fontSize={10}
              fontWeight="bold"
              fill={textFill}
            >
              N{node.id}
            </text>
            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              fontSize={9}
              fill={textFill}
              opacity={0.7}
            >
              T{node.term}
            </text>
            <text
              x={node.x}
              y={node.y + 46}
              textAnchor="middle"
              fontSize={8}
              fill={textFill}
              opacity={0.5}
            >
              {node.state}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // ─── Gossip SVG Rendering ───────────────────────────────────
  const renderGossipSVG = () => {
    const { nodes, messages, step } = gossipState;

    return (
      <svg
        viewBox="0 0 500 400"
        width="100%"
        style={{ maxWidth: 500, background: svgBg, borderRadius: 12 }}
      >
        {/* Messages in flight */}
        {messages.map((msg, i) => {
          const fromNode = nodes.find((n) => n.id === msg.from);
          const toNode = nodes.find((n) => n.id === msg.to);
          if (!fromNode || !toNode) return null;
          const x =
            fromNode.x + (toNode.x - fromNode.x) * Math.min(msg.progress, 1);
          const y =
            fromNode.y + (toNode.y - fromNode.y) * Math.min(msg.progress, 1);
          return (
            <circle
              key={`gm-${i}`}
              cx={x}
              cy={y}
              r={3}
              fill="#63B3ED"
              opacity={0.7}
            >
              <title>
                {msg.key} from N{msg.from}
              </title>
            </circle>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const staleness = step - node.lastUpdated;
          const brightness = node.lastUpdated === 0 ? 0.3 : Math.max(0.3, 1 - staleness * 0.05);
          const hasData = Object.keys(node.data).length > 0;
          return (
            <g
              key={node.id}
              onClick={() => handleGossipNodeClick(node.id)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={30}
                fill={
                  !node.alive
                    ? '#FC8181'
                    : hasData
                      ? `rgba(72, 187, 120, ${brightness})`
                      : '#A0AEC0'
                }
                opacity={node.alive ? 0.9 : 0.3}
                stroke={
                  selectedGossipNode === node.id ? '#3182CE' : 'transparent'
                }
                strokeWidth={3}
              />
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill={textFill}
              >
                N{node.id}
              </text>
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                fontSize={8}
                fill={textFill}
                opacity={0.6}
              >
                {Object.keys(node.data).length} keys
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // ─── Selected Raft Node Detail ──────────────────────────────
  const selectedNode: RaftNode | undefined =
    selectedRaftNode !== null
      ? raftState.nodes.find((n) => n.id === selectedRaftNode)
      : undefined;

  // ─── Selected Gossip Node Detail ────────────────────────────
  const selectedGNode: GossipNodeType | undefined =
    selectedGossipNode !== null
      ? gossipState.nodes.find((n) => n.id === selectedGossipNode)
      : undefined;

  return (
    <Container maxW="container.xl" py={8}>
      <SlideFade in offsetY={20}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Link as={NextLink} href="/labs">
              <IconButton
                aria-label="Go back"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              />
            </Link>
            <Badge
              colorScheme="blue"
              fontSize="sm"
              px={2}
              py={1}
              borderRadius="md"
            >
              Systems
            </Badge>
          </HStack>

          <Box>
            <Heading size="xl" mb={2}>
              {'🌐 Distributed Systems Simulator'}
            </Heading>
            <Paragraph>
              Explore how distributed consensus and gossip protocols work.
              Simulate leader election, network partitions, and data
              propagation.
            </Paragraph>
          </Box>

          <Divider />

          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab fontWeight="bold">Raft Consensus</Tab>
              <Tab fontWeight="bold">Gossip Protocol</Tab>
            </TabList>

            <TabPanels>
              {/* ═══ RAFT TAB ═══ */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  {/* Controls */}
                  <Box
                    bg={cardBg}
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Flex wrap="wrap" gap={3} align="center">
                      <Button
                        size="sm"
                        colorScheme={raftPlaying ? 'red' : 'green'}
                        onClick={() => setRaftPlaying((p) => !p)}
                      >
                        {raftPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={stepRaftOnce}
                        isDisabled={raftPlaying}
                      >
                        Step
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetRaft}
                      >
                        Reset
                      </Button>
                      <Divider orientation="vertical" h="24px" />
                      <Button
                        size="sm"
                        variant={partitionMode ? 'solid' : 'outline'}
                        colorScheme={partitionMode ? 'red' : 'gray'}
                        onClick={() => {
                          setPartitionMode((p) => !p);
                          setPartitionFirst(null);
                        }}
                      >
                        {partitionMode
                          ? partitionFirst !== null
                            ? `Click 2nd node (1st: N${partitionFirst})`
                            : 'Click 1st node...'
                          : 'Partition Mode'}
                      </Button>
                      <Divider orientation="vertical" h="24px" />
                      <HStack spacing={2}>
                        <Text fontSize="xs" color={subtleText}>
                          Speed
                        </Text>
                        <Box w="120px">
                          <Slider
                            min={100}
                            max={1500}
                            step={100}
                            value={1600 - raftSpeed}
                            onChange={(v) => setRaftSpeed(1600 - v)}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </Box>
                      </HStack>
                    </Flex>

                    {/* Client request */}
                    <Flex mt={3} gap={2}>
                      <Input
                        size="sm"
                        placeholder="Log entry value..."
                        value={clientValue}
                        onChange={(e) => setClientValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleClientRequest();
                        }}
                        maxW="200px"
                      />
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={handleClientRequest}
                      >
                        Client Request
                      </Button>
                    </Flex>
                  </Box>

                  {/* SVG + Detail panel */}
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                  >
                    <Box flex={1}>
                      {renderRaftSVG()}
                      <Text fontSize="xs" color={subtleText} mt={2}>
                        Click a node to view details. Step {raftState.stepCount}
                      </Text>
                    </Box>

                    {/* Node detail */}
                    <Box
                      w={{ base: '100%', md: '250px' }}
                      bg={cardBg}
                      p={4}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Heading size="sm" mb={3}>
                        Node Detail
                      </Heading>
                      {selectedNode ? (
                        <VStack align="stretch" spacing={2} fontSize="sm">
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Node</Text>
                            <Text>N{selectedNode.id}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">State</Text>
                            <Badge
                              colorScheme={
                                selectedNode.state === 'leader'
                                  ? 'green'
                                  : selectedNode.state === 'candidate'
                                    ? 'yellow'
                                    : selectedNode.state === 'dead'
                                      ? 'red'
                                      : 'gray'
                              }
                            >
                              {selectedNode.state}
                            </Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Term</Text>
                            <Text>{selectedNode.term}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Voted For</Text>
                            <Text>
                              {selectedNode.votedFor !== null
                                ? `N${selectedNode.votedFor}`
                                : '-'}
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Commit Idx</Text>
                            <Text>{selectedNode.commitIndex}</Text>
                          </HStack>
                          <Divider />
                          <Text fontWeight="bold">
                            Log ({selectedNode.log.length} entries)
                          </Text>
                          <Box
                            maxH="120px"
                            overflowY="auto"
                            bg={logBg}
                            p={2}
                            borderRadius="md"
                            fontSize="xs"
                          >
                            {selectedNode.log.length === 0 ? (
                              <Text color={subtleText}>Empty</Text>
                            ) : (
                              selectedNode.log.map((entry, i) => (
                                <Text key={i}>
                                  [{entry.term}] {entry.value}
                                </Text>
                              ))
                            )}
                          </Box>
                          <Button
                            size="xs"
                            colorScheme={
                              selectedNode.state === 'dead' ? 'green' : 'red'
                            }
                            onClick={() => handleKillRevive(selectedNode.id)}
                          >
                            {selectedNode.state === 'dead'
                              ? 'Revive Node'
                              : 'Kill Node'}
                          </Button>
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color={subtleText}>
                          Click a node in the diagram to inspect it.
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {/* Event log */}
                  <Box
                    bg={cardBg}
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Heading size="sm" mb={2}>
                      Event Log
                    </Heading>
                    <Box
                      maxH="200px"
                      overflowY="auto"
                      bg={logBg}
                      p={3}
                      borderRadius="md"
                      fontSize="xs"
                      fontFamily="mono"
                    >
                      {raftState.eventLog.length === 0 ? (
                        <Text color={subtleText}>
                          No events yet. Press Play or Step to begin.
                        </Text>
                      ) : (
                        raftState.eventLog.map((evt, i) => (
                          <Text key={i}>
                            <Text as="span" fontWeight="bold" color="blue.400">
                              [{evt.step}]
                            </Text>{' '}
                            {evt.description}
                          </Text>
                        ))
                      )}
                    </Box>
                  </Box>

                  {/* Legend */}
                  <Flex wrap="wrap" gap={4} justify="center" py={2}>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="gray.400"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color={subtleText}>
                        Follower
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="yellow.400"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color={subtleText}>
                        Candidate
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="green.400"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color={subtleText}>
                        Leader
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box w={3} h={3} bg="red.300" borderRadius="full" />
                      <Text fontSize="xs" color={subtleText}>
                        Dead
                      </Text>
                    </HStack>
                  </Flex>
                </VStack>
              </TabPanel>

              {/* ═══ GOSSIP TAB ═══ */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  {/* Controls */}
                  <Box
                    bg={cardBg}
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Flex wrap="wrap" gap={3} align="center">
                      <Button
                        size="sm"
                        colorScheme={gossipPlaying ? 'red' : 'green'}
                        onClick={() => setGossipPlaying((p) => !p)}
                      >
                        {gossipPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setGossipState((s) => stepGossip(s))
                        }
                        isDisabled={gossipPlaying}
                      >
                        Step
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetGossip}
                      >
                        Reset
                      </Button>
                      <Divider orientation="vertical" h="24px" />
                      <HStack spacing={2}>
                        <Text fontSize="xs" color={subtleText}>
                          Speed
                        </Text>
                        <Box w="120px">
                          <Slider
                            min={100}
                            max={1500}
                            step={100}
                            value={1600 - gossipSpeed}
                            onChange={(v) => setGossipSpeed(1600 - v)}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </Box>
                      </HStack>
                    </Flex>
                  </Box>

                  {/* SVG + Detail panel */}
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                  >
                    <Box flex={1}>
                      {renderGossipSVG()}
                      <Text fontSize="xs" color={subtleText} mt={2}>
                        Click a node to select it, then update its data
                        below. Step {gossipState.step}
                      </Text>
                    </Box>

                    {/* Node detail / update */}
                    <Box
                      w={{ base: '100%', md: '280px' }}
                      bg={cardBg}
                      p={4}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Heading size="sm" mb={3}>
                        {selectedGNode
                          ? `Node ${selectedGNode.id} Data`
                          : 'Node Detail'}
                      </Heading>
                      {selectedGNode ? (
                        <VStack align="stretch" spacing={3}>
                          <Box
                            maxH="150px"
                            overflowY="auto"
                            bg={logBg}
                            p={2}
                            borderRadius="md"
                            fontSize="xs"
                            fontFamily="mono"
                          >
                            {Object.keys(selectedGNode.data).length === 0 ? (
                              <Text color={subtleText}>No data yet</Text>
                            ) : (
                              Object.entries(selectedGNode.data).map(
                                ([k, v]) => (
                                  <Text key={k}>
                                    <Text
                                      as="span"
                                      fontWeight="bold"
                                      color="blue.400"
                                    >
                                      {k}
                                    </Text>
                                    : {v.value}{' '}
                                    <Text as="span" opacity={0.5}>
                                      (v{v.version})
                                    </Text>
                                  </Text>
                                ),
                              )
                            )}
                          </Box>
                          <Divider />
                          <Text fontSize="xs" fontWeight="bold">
                            Update this node:
                          </Text>
                          <Input
                            size="sm"
                            placeholder="Key"
                            value={gossipKey}
                            onChange={(e) => setGossipKey(e.target.value)}
                          />
                          <Input
                            size="sm"
                            placeholder="Value"
                            value={gossipValue}
                            onChange={(e) => setGossipValue(e.target.value)}
                          />
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={handleGossipUpdate}
                          >
                            Set Data
                          </Button>
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color={subtleText}>
                          Click a node to select and update it.
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {/* Legend */}
                  <Flex wrap="wrap" gap={4} justify="center" py={2}>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="green.400"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color={subtleText}>
                        Recently updated
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="green.400"
                        borderRadius="full"
                        opacity={0.3}
                      />
                      <Text fontSize="xs" color={subtleText}>
                        Stale data
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="gray.400"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color={subtleText}>
                        No data
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box
                        w={3}
                        h={3}
                        bg="blue.300"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color={subtleText}>
                        Gossip message
                      </Text>
                    </HStack>
                  </Flex>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </SlideFade>
    </Container>
  );
}
