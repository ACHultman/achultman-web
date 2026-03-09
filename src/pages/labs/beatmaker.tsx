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

import Paragraph from '@components/Paragraph';
import {
  INSTRUMENTS,
  STEPS,
  EXAMPLE_PROMPTS,
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
      touchAction="manipulation"
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

  const dimText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = useColorModeValue('purple.500', 'purple.300');



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
      <Container maxW="container.lg" pb={16}>
        <SlideFade in={true} offsetY={80}>
          {/* Header */}
          <Flex align="center" mb={6} mt={2}>
            <IconButton
              as={NextLink}
              href="/labs"
              aria-label="Back to Labs"
              icon={<ArrowBackIcon />}
              variant="ghost"
              mr={3}
            />
            <Box>
              <HStack spacing={2} mb={1}>
                <Heading as="h1" fontSize={{ base: '24px', md: '32px' }}>
                  🎵 BeatMaker
                </Heading>
                <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                  Live
                </Badge>
              </HStack>
              <Paragraph fontSize="sm" color={dimText}>
                Describe a beat in words → hear it come alive. Toggle cells to remix.
              </Paragraph>
            </Box>
          </Flex>

          {/* Prompt Input — mobile-first: stacked, full-width */}
          <Box bg={cardBg} borderRadius="xl" p={{ base: 4, md: 6 }} mb={6} shadow="sm" borderWidth="1px">
            <Text fontSize="sm" fontWeight="bold" mb={3}>
              🎤 Describe your beat
            </Text>
            <VStack spacing={3} align="stretch">
              <Input
                as="textarea"
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                placeholder={randomPrompt}
                bg={inputBg}
                size="lg"
                borderRadius="lg"
                minH={{ base: '56px', md: '48px' }}
                py={3}
                px={4}
                fontSize={{ base: 'md', md: 'lg' }}
                resize="none"
                rows={2}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateBeat(prompt || randomPrompt);
                  }
                }}
              />
              <Button
                colorScheme="purple"
                size="lg"
                w="100%"
                h={{ base: '52px', md: '48px' }}
                onClick={() => generateBeat(prompt || randomPrompt)}
                borderRadius="lg"
                fontSize={{ base: 'md', md: 'lg' }}
              >
                Generate 🔥
              </Button>
            </VStack>

            {/* Quick prompts — larger tap targets */}
            <Wrap mt={4} spacing={{ base: 2, md: 2 }}>
              {EXAMPLE_PROMPTS.slice(0, 4).map((ex) => (
                <WrapItem key={ex}>
                  <Badge
                    as="button"
                    cursor="pointer"
                    colorScheme="gray"
                    variant="subtle"
                    px={{ base: 4, md: 3 }}
                    py={{ base: 2, md: 1 }}
                    borderRadius="full"
                    fontSize={{ base: 'sm', md: 'xs' }}
                    minH="44px"
                    display="flex"
                    alignItems="center"
                    _hover={{ colorScheme: 'purple', transform: 'scale(1.05)' }}
                    _active={{ transform: 'scale(0.95)' }}
                    transition="all 0.15s"
                    onClick={() => {
                      setPrompt(ex);
                      generateBeat(ex);
                    }}
                  >
                    {ex.length > 35 ? ex.slice(0, 35) + '…' : ex}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>

            <AnimatePresence>
              {hasGenerated && generatedLabel && (
                <MotionBox
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  mt={3}
                >
                  <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                    ✨ {generatedLabel}
                  </Badge>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>

          {/* Transport Controls — mobile-first: stacked, large touch targets */}
          <VStack
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 4, md: 4 }}
            mb={4}
            shadow="sm"
            borderWidth="1px"
            spacing={4}
            align="stretch"
          >
            {/* BPM slider — full width on mobile */}
            <HStack spacing={4}>
              <Text fontSize="sm" fontWeight="bold" whiteSpace="nowrap" minW="80px">
                🎚️ {bpm} BPM
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
                <SliderTrack h="8px" borderRadius="full">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={{ base: 7, md: 5 }} />
              </Slider>
            </HStack>

            {/* Play/Stop + Clear — large, thumb-friendly */}
            <Flex gap={3}>
              <Button
                onClick={isPlaying ? stopPlayback : startPlayback}
                colorScheme={isPlaying ? 'red' : 'green'}
                size="lg"
                borderRadius="full"
                h={{ base: '56px', md: '60px' }}
                flex={1}
                fontSize="xl"
              >
                {isPlaying ? '⏹ Stop' : '▶ Play'}
              </Button>
              <Button
                onClick={clearPattern}
                variant="outline"
                size="lg"
                borderRadius="full"
                h={{ base: '56px', md: '60px' }}
                minW={{ base: '80px', md: '80px' }}
                fontSize="md"
              >
                Clear
              </Button>
            </Flex>

            {/* Step indicator — hidden on mobile */}
            <HStack spacing={1} display={{ base: 'none', md: 'flex' }} justify="center">
              {Array.from({ length: STEPS }, (_, i) => (
                <Box
                  key={i}
                  w="6px"
                  h="12px"
                  borderRadius="sm"
                  bg={
                    currentStep === i
                      ? 'purple.400'
                      : i % 4 === 0
                      ? 'gray.400'
                      : 'gray.600'
                  }
                  transition="background 0.05s"
                />
              ))}
            </HStack>
          </VStack>

          {/* Sequencer Grid — mobile-first: min 44px cells, horizontal scroll */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 3, md: 6 }}
            shadow="sm"
            borderWidth="1px"
          >
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              🎛️ Sequencer Grid
              <Text as="span" fontWeight="normal" color={dimText} ml={2}>
                — tap cells to toggle
              </Text>
            </Text>
            <Text fontSize="xs" color={dimText} mb={3} display={{ base: 'block', md: 'none' }}>
              ← Swipe to see all steps →
            </Text>

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

          {/* Tips */}
          <Box mt={6} p={4} borderRadius="lg" bg={inputBg} fontSize="sm" color={dimText}>
            <Text fontWeight="bold" mb={2}>
              💡 Tips
            </Text>
            <VStack align="start" spacing={1}>
              <Text>
                • Try genres: <b>lofi</b>, <b>trap</b>, <b>house</b>, <b>dnb</b>, <b>jazz</b>, <b>techno</b>, <b>reggaeton</b>, <b>boom-bap</b>
              </Text>
              <Text>
                • Add modifiers: <b>slow</b>, <b>fast</b>, <b>bass heavy</b>, <b>with piano</b>
              </Text>
              <Text>
                • Click grid cells to toggle beats on/off — remix the generated pattern
              </Text>
              <Text>
                • Adjust BPM with the slider while playing for tempo changes
              </Text>
            </VStack>
          </Box>

          <Divider my={6} />

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
