import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { NextSeo } from 'next-seo';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import {
  INSTRUMENTS,
  STEPS,
  EXAMPLE_PROMPTS,
  PRESET_CHIPS,
  parseTextToBeat,
  type Pattern,
} from '@data/beatmakerData';

const MotionBox = motion(Box);

// ─── Tone.js lazy loader ─────────────────────────────────────────────────────
// Tone.js only works client-side; we lazy-import it to avoid SSR issues.
let ToneModule: typeof import('tone') | null = null;

async function getTone() {
  if (!ToneModule) {
    ToneModule = await import('tone');
  }
  return ToneModule;
}

// ─── Audio Engine ────────────────────────────────────────────────────────────
interface AudioEngine {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  synths: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sequence: any | null;
  started: boolean;
}

function createSynths(Tone: typeof import('tone')) {
  return {
    Kick: new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 },
    }).toDestination(),
    Snare: new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
    }).toDestination(),
    'Hi-Hat': new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.06, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination(),
    Bass: new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: { Q: 2, type: 'lowpass', rolloff: -24 },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.1 },
      filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2, baseFrequency: 100, octaves: 2.5 },
    }).toDestination(),
    Synth: new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.4 },
    }).toDestination(),
  };
}

// ─── Sequencer Grid Cell ─────────────────────────────────────────────────────
function Cell({
  active,
  playing,
  color,
  onClick,
}: {
  active: boolean;
  playing: boolean;
  color: string;
  onClick: () => void;
}) {
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const inactiveHover = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      as="button"
      onClick={onClick}
      w="100%"
      minW="44px"
      minH="44px"
      pt="100%"
      position="relative"
      borderRadius="md"
      border="1px solid"
      borderColor={playing ? 'white' : borderColor}
      bg={active ? color : inactiveBg}
      opacity={active ? 1 : 0.5}
      _hover={{
        bg: active ? color : inactiveHover,
        opacity: 1,
        transform: 'scale(1.05)',
      }}
      _active={{
        transform: 'scale(0.95)',
      }}
      transition="all 0.1s ease"
      boxShadow={playing && active ? `0 0 12px ${color}` : playing ? '0 0 6px rgba(255,255,255,0.3)' : 'none'}
      aria-label={active ? 'Mute step' : 'Activate step'}
      /* Prevent touch delay on mobile */
      sx={{ touchAction: 'manipulation' }}
    >
      {playing && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius="md"
          border="2px solid"
          borderColor="white"
          pointerEvents="none"
        />
      )}
    </Box>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BeatMaker() {
  const [prompt, setPrompt] = useState('');
  const [pattern, setPattern] = useState<Pattern>(() =>
    INSTRUMENTS.map(() => Array(STEPS).fill(false))
  );
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [generatedLabel, setGeneratedLabel] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const engineRef = useRef<AudioEngine | null>(null);
  const stepRef = useRef(0);
  const patternRef = useRef(pattern);

  // Keep patternRef in sync
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const dimText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const chipBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const chipColor = useColorModeValue('gray.700', 'gray.300');
  const chipHoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');



  // ─── Generate beat from text ─────────────────────────────────────────
  // ─── Stop playback ────────────────────────────────────────────────────
  const stopPlayback = useCallback(async () => {
    const Tone = await getTone();
    Tone.getTransport().stop();
    if (engineRef.current?.sequence) {
      engineRef.current.sequence.stop();
    }
    setIsPlaying(false);
    setCurrentStep(-1);
  }, []);

  const generateBeat = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const result = parseTextToBeat(text);
      setPattern(result.pattern);
      setBpm(result.bpm);
      setGeneratedLabel(result.description);
      setHasGenerated(true);
      // Stop playback if playing
      if (isPlaying) {
        stopPlayback();
      }
    },
    [isPlaying, stopPlayback]
  );

  // ─── Toggle cell ─────────────────────────────────────────────────────
  const toggleCell = useCallback((instrument: number, step: number) => {
    setPattern((prev) => {
      const next = prev.map((row) => [...row]);
      const row = next[instrument];
      if (row) {
        row[step] = !row[step];
      }
      return next;
    });
  }, []);

  // ─── Audio playback ──────────────────────────────────────────────────
  const startPlayback = useCallback(async () => {
    const Tone = await getTone();
    await Tone.start();

    if (!engineRef.current) {
      const synths = createSynths(Tone);
      engineRef.current = { synths, sequence: null, started: false };
    }

    Tone.getTransport().bpm.value = bpm;
    stepRef.current = 0;

    // Instrument note mapping
    const notes = ['C2', 'noise', 'metal', 'C1', 'C4'];

    if (engineRef.current?.sequence) {
      engineRef.current.sequence.dispose();
    }

    const seq = new Tone.Sequence(
      (time: number, step: number) => {
        setCurrentStep(step);
        stepRef.current = step;
        const pat = patternRef.current;

        pat.forEach((row, i) => {
          if (!row[step]) return;
          const inst = INSTRUMENTS[i];
          if (!inst) return;
          const synth = engineRef.current?.synths[inst.name];
          if (!synth) return;
          if (inst.name === 'Snare') {
            synth.triggerAttackRelease('16n', time);
          } else if (inst.name === 'Hi-Hat') {
            synth.triggerAttackRelease('C4', '32n', time, 0.3);
          } else if (inst.name === 'Synth') {
            synth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', time, 0.3);
          } else {
            synth.triggerAttackRelease(notes[i], '8n', time);
          }
        });
      },
      Array.from({ length: STEPS }, (_, i) => i),
      '16n'
    );

    seq.start(0);
    engineRef.current.sequence = seq;
    Tone.getTransport().start();
    setIsPlaying(true);
  }, [bpm]);

  // Update BPM live
  useEffect(() => {
    if (isPlaying && ToneModule) {
      ToneModule.getTransport().bpm.value = bpm;
    }
  }, [bpm, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ToneModule) {
        ToneModule.getTransport().stop();
        ToneModule.getTransport().cancel();
      }
      if (engineRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(engineRef.current.synths).forEach((s: any) => s.dispose?.());
        engineRef.current.sequence?.dispose();
      }
    };
  }, []);

  // ─── Clear pattern ───────────────────────────────────────────────────
  const clearPattern = useCallback(() => {
    setPattern(INSTRUMENTS.map(() => Array(STEPS).fill(false)));
    setHasGenerated(false);
    setGeneratedLabel('');
    setPrompt('');
  }, []);

  // Random example prompt
  const randomPrompt = useMemo(
    () => EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)] ?? EXAMPLE_PROMPTS[0] ?? '',
    []
  );

  return (
    <>
      <NextSeo
        title="BeatMaker — Labs"
        description="Describe a beat in plain text and hear it come alive. Interactive browser-based beat sequencer powered by Tone.js."
        canonical="https://hultman.dev/labs/beatmaker"
      />
      <Container maxW="container.lg" pb={10}>
        <SlideFade in={true} offsetY={80}>
          {/* Header — compact */}
          <Flex align="center" mb={3} mt={2}>
            <IconButton
              as={NextLink}
              href="/labs"
              aria-label="Back to Labs"
              icon={<ArrowBackIcon />}
              variant="ghost"
              mr={2}
              size="sm"
            />
            <HStack spacing={2}>
              <Heading as="h1" fontSize={{ base: '20px', md: '28px' }}>
                🎵 BeatMaker
              </Heading>
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                Live
              </Badge>
            </HStack>
          </Flex>

          {/* Prompt Input — chat-style compact bar */}
          <Box bg={cardBg} borderRadius="2xl" p={{ base: 3, md: 4 }} mb={3} shadow="sm" borderWidth="1px">
            <Flex gap={2} align="flex-end">
              <Input
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                placeholder={randomPrompt ? (randomPrompt.length > 30 ? randomPrompt.slice(0, 30) + '…' : randomPrompt) : 'Describe a beat…'}
                bg={inputBg}
                size="md"
                borderRadius="full"
                h="44px"
                px={4}
                fontSize="sm"
                flex={1}
                border="none"
                _focus={{ boxShadow: '0 0 0 2px var(--chakra-colors-purple-400)', bg: inputBg }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    generateBeat(prompt || randomPrompt);
                  }
                }}
              />
              <Button
                colorScheme="purple"
                size="md"
                h="44px"
                px={6}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                onClick={() => generateBeat(prompt || randomPrompt)}
                flexShrink={0}
                _hover={{ transform: 'scale(1.03)' }}
                _active={{ transform: 'scale(0.97)' }}
                transition="all 0.15s ease"
              >
                Generate 🔥
              </Button>
            </Flex>

            {/* Preset chips — pill-shaped, horizontal flow */}
            <Wrap mt={3} spacing={2}>
              {PRESET_CHIPS.map((chip) => (
                <WrapItem key={chip.label}>
                  <Box
                    as="button"
                    cursor="pointer"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="semibold"
                    bg={activePreset === chip.label ? 'purple.500' : chipBg}
                    color={activePreset === chip.label ? 'white' : chipColor}
                    boxShadow={activePreset === chip.label ? '0 0 12px rgba(128,90,213,0.5)' : 'none'}
                    _hover={{
                      bg: activePreset === chip.label ? 'purple.600' : chipHoverBg,
                      transform: 'scale(1.05)',
                    }}
                    _active={{ transform: 'scale(0.95)' }}
                    transition="all 0.2s ease"
                    onClick={() => {
                      setActivePreset(chip.label);
                      setPrompt(chip.prompt);
                      generateBeat(chip.prompt);
                    }}
                  >
                    {chip.label}
                  </Box>
                </WrapItem>
              ))}
            </Wrap>

            <AnimatePresence>
              {hasGenerated && generatedLabel && (
                <MotionBox
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  mt={2}
                >
                  <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
                    ✨ {generatedLabel}
                  </Badge>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>

          {/* Transport Controls — compact, inline */}
          <Flex
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 3, md: 4 }}
            mb={3}
            shadow="sm"
            borderWidth="1px"
            gap={3}
            align="center"
            wrap="wrap"
          >
            {/* Play/Stop — with pulse animation when active */}
            <Button
              onClick={isPlaying ? stopPlayback : startPlayback}
              colorScheme={isPlaying ? 'red' : 'green'}
              size="md"
              borderRadius="full"
              h="44px"
              minW="100px"
              fontSize="md"
              fontWeight="bold"
              boxShadow={isPlaying ? '0 0 16px rgba(245,101,101,0.4)' : 'none'}
              animation={isPlaying ? 'pulse-glow 2s ease-in-out infinite' : 'none'}
              sx={{
                '@keyframes pulse-glow': {
                  '0%, 100%': { boxShadow: '0 0 8px rgba(245,101,101,0.3)' },
                  '50%': { boxShadow: '0 0 20px rgba(245,101,101,0.6)' },
                },
              }}
            >
              {isPlaying ? '⏹ Stop' : '▶ Play'}
            </Button>
            <Button
              onClick={clearPattern}
              variant="ghost"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              color={dimText}
            >
              Clear
            </Button>

            {/* BPM slider — inline */}
            <HStack spacing={2} flex={1} minW="140px">
              <Text fontSize="xs" fontWeight="bold" whiteSpace="nowrap" color={dimText}>
                {bpm} BPM
              </Text>
              <Slider
                value={bpm}
                min={60}
                max={200}
                step={1}
                onChange={(val: number) => setBpm(val)}
                colorScheme="purple"
                flex={1}
              >
                <SliderTrack h="6px" borderRadius="full">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={5} />
              </Slider>
            </HStack>
          </Flex>

          {/* Sequencer Grid — compact */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 2, md: 4 }}
            shadow="sm"
            borderWidth="1px"
          >
            <Flex align="center" mb={1.5} gap={2}>
              <Text fontSize="xs" fontWeight="bold">
                🎛️ Sequencer
              </Text>
              <Text fontSize="xs" color={dimText} display={{ base: 'inline', md: 'none' }}>
                swipe →
              </Text>
            </Flex>

            <Box overflowX="auto" pb={2} sx={{
              /* Smooth momentum scroll on iOS */
              WebkitOverflowScrolling: 'touch',
              /* Hide scrollbar on mobile for cleaner look */
              '&::-webkit-scrollbar': { height: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.400', borderRadius: 'full' },
            }}>
              <VStack spacing={{ base: 2, md: 2 }} align="stretch" minW={{ base: `${STEPS * 46 + 70}px`, md: 'auto' }}>
                {INSTRUMENTS.map((inst, instIdx) => (
                  <Flex key={inst.name} align="center" gap={2}>
                    {/* Instrument label — sticky on scroll */}
                    <Flex
                      minW={{ base: '56px', md: '90px' }}
                      maxW={{ base: '56px', md: '90px' }}
                      align="center"
                      justify="flex-end"
                      pr={1}
                      position="sticky"
                      left={0}
                      zIndex={1}
                      bg={cardBg}
                    >
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium" whiteSpace="nowrap">
                        <Text as="span" display={{ base: 'inline', sm: 'inline' }}>
                          {inst.emoji}
                        </Text>
                        <Text as="span" display={{ base: 'none', md: 'inline' }}>
                          {' '}{inst.name}
                        </Text>
                      </Text>
                    </Flex>

                    {/* Steps — fixed cell sizes for touch targets */}
                    <Grid
                      templateColumns={{ base: `repeat(${STEPS}, 44px)`, md: `repeat(${STEPS}, 1fr)` }}
                      gap={{ base: '2px', md: '3px' }}
                      flex={{ base: 'none', md: 1 }}
                    >
                      {Array.from({ length: STEPS }, (_, stepIdx) => (
                        <GridItem key={stepIdx}>
                          <Cell
                            active={pattern[instIdx]?.[stepIdx] ?? false}
                            playing={currentStep === stepIdx}
                            color={inst.color}
                            onClick={() => toggleCell(instIdx, stepIdx)}
                          />
                        </GridItem>
                      ))}
                    </Grid>
                  </Flex>
                ))}

                {/* Beat markers */}
                <Flex align="center" gap={2}>
                  <Box minW={{ base: '56px', md: '90px' }} maxW={{ base: '56px', md: '90px' }} position="sticky" left={0} zIndex={1} bg={cardBg} />
                  <Grid
                    templateColumns={{ base: `repeat(${STEPS}, 44px)`, md: `repeat(${STEPS}, 1fr)` }}
                    gap={{ base: '2px', md: '3px' }}
                    flex={{ base: 'none', md: 1 }}
                  >
                    {Array.from({ length: STEPS }, (_, i) => (
                      <GridItem key={i}>
                        <Text
                          fontSize={{ base: '10px', md: '8px' }}
                          textAlign="center"
                          color={i % 4 === 0 ? dimText : 'transparent'}
                          fontWeight={i % 4 === 0 ? 'bold' : 'normal'}
                        >
                          {i % 4 === 0 ? i / 4 + 1 : '·'}
                        </Text>
                      </GridItem>
                    ))}
                  </Grid>
                </Flex>
              </VStack>
            </Box>
          </Box>

          {/* Tips — collapsible-feeling, compact */}
          <Box mt={4} p={3} borderRadius="lg" bg={inputBg} fontSize="xs" color={dimText}>
            <Text fontWeight="bold" mb={1}>💡 Tips</Text>
            <Text>Try modifiers: <b>slow</b>, <b>fast</b>, <b>bass heavy</b>, <b>with piano</b>. Tap grid cells to remix. Adjust BPM while playing.</Text>
          </Box>

          <Divider my={4} />

          <Flex justify="space-between" fontSize="xs" color={dimText}>
            <Text>
              Built with{' '}
              <Link href="https://tonejs.github.io/" isExternal color={accentColor}>
                Tone.js
              </Link>
              {' · '}
              <Link as={NextLink} href="/labs" color={accentColor}>
                ← Back to Labs
              </Link>
            </Text>
            <Link
              href="https://github.com/ACHultman/achultman-web"
              isExternal
              color={accentColor}
            >
              View Source →
            </Link>
          </Flex>
        </SlideFade>
      </Container>
    </>
  );
}
