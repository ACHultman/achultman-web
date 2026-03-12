import { useCallback, useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
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
  Textarea,
  Tooltip,
  Wrap,
  WrapItem,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, LockIcon } from '@chakra-ui/icons';
import Paragraph from '@components/Paragraph';
import {
  SHADER_PRESETS,
  SHADER_CATEGORIES,
  DEFAULT_VERTEX_SHADER,
  QUICK_PROMPT_CHIPS,
  generateShader,
} from '@data/shaderData';
import type { GeneratedShader } from '@data/shaderData';

const MotionBox = motion(Box);

export default function ShaderPlayground() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [code, setCode] = useState(SHADER_PRESETS[0]!.fragmentShader);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [compileTimeMs, setCompileTimeMs] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [promptResult, setPromptResult] = useState<GeneratedShader | null>(
    null
  );
  const [promptError, setPromptError] = useState(false);

  // Audio-reactive state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioBassRef = useRef<number>(0);
  const audioMidRef = useRef<number>(0);
  const audioTrebleRef = useRef<number>(0);

  // Shareable URL debounce
  const urlDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(Date.now());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // --- Shareable URL: decode hash on mount ---
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = decodeURIComponent(atob(hash));
        setCode(decoded);
        setSelectedPreset(-1);
      } catch {
        // Invalid hash, ignore
      }
    }
  }, []);

  // --- Shareable URL: encode hash on code change (debounced) ---
  useEffect(() => {
    if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    urlDebounceRef.current = setTimeout(() => {
      try {
        const encoded = btoa(encodeURIComponent(code));
        window.history.replaceState(null, '', `#${encoded}`);
      } catch {
        // Encoding failed, ignore
      }
    }, 1000);
    return () => {
      if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    };
  }, [code]);

  // --- Audio: update frequency data each frame ---
  const updateAudioData = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Determine frequency bin boundaries based on sample rate
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const binHz = sampleRate / (analyser.fftSize);

    const bin200 = Math.min(Math.floor(200 / binHz), bufferLength);
    const bin2000 = Math.min(Math.floor(2000 / binHz), bufferLength);

    // Bass: 0-200Hz
    let bassSum = 0;
    const bassCount = Math.max(bin200, 1);
    for (let i = 0; i < bassCount; i++) {
      bassSum += dataArray[i]!;
    }
    audioBassRef.current = bassSum / (bassCount * 255);

    // Mid: 200-2000Hz
    let midSum = 0;
    const midCount = Math.max(bin2000 - bin200, 1);
    for (let i = bin200; i < bin2000; i++) {
      midSum += dataArray[i]!;
    }
    audioMidRef.current = midSum / (midCount * 255);

    // Treble: 2000Hz+
    let trebleSum = 0;
    const trebleCount = Math.max(bufferLength - bin2000, 1);
    for (let i = bin2000; i < bufferLength; i++) {
      trebleSum += dataArray[i]!;
    }
    audioTrebleRef.current = trebleSum / (trebleCount * 255);
  }, []);

  // --- Audio: toggle ---
  const handleToggleAudio = useCallback(async () => {
    if (audioEnabled) {
      // Disable audio
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current) {
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      audioBassRef.current = 0;
      audioMidRef.current = 0;
      audioTrebleRef.current = 0;
      setAudioEnabled(false);
      setAudioError(null);
      return;
    }

    // Enable audio — AudioContext created on user gesture
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      audioStreamRef.current = stream;
      setAudioEnabled(true);
      setAudioError(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Microphone access denied';
      setAudioError(msg);
      setAudioEnabled(false);
    }
  }, [audioEnabled]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const compileShader = useCallback(
    (
      gl: WebGLRenderingContext,
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        if (type === gl.FRAGMENT_SHADER && info) {
          setError(info);
        }
        return null;
      }
      return shader;
    },
    []
  );

  const buildProgram = useCallback(
    (gl: WebGLRenderingContext, fragSource: string): WebGLProgram | null => {
      const t0 = performance.now();
      const vs = compileShader(gl, DEFAULT_VERTEX_SHADER, gl.VERTEX_SHADER);
      if (!vs) return null;
      const fs = compileShader(gl, fragSource, gl.FRAGMENT_SHADER);
      if (!fs) {
        gl.deleteShader(vs);
        return null;
      }
      const prog = gl.createProgram();
      if (!prog) {
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return null;
      }
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(prog);
        setError(info || 'Program link failed');
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return null;
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      setError(null);
      const t1 = performance.now();
      setCompileTimeMs(Math.round(t1 - t0));
      return prog;
    },
    [compileShader]
  );

  const recompile = useCallback(
    (fragSource: string) => {
      const gl = glRef.current;
      if (!gl) return;
      const newProg = buildProgram(gl, fragSource);
      if (newProg) {
        if (programRef.current) {
          gl.deleteProgram(programRef.current);
        }
        programRef.current = newProg;
      }
    },
    [buildProgram]
  );

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      setError('WebGL is not supported in your browser.');
      return;
    }
    glRef.current = gl;

    // Full-screen quad vertices
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Build initial program
    const prog = buildProgram(gl, code);
    if (prog) {
      programRef.current = prog;
    }

    startTimeRef.current = Date.now();

    const render = () => {
      if (!glRef.current || !programRef.current || !canvasRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const cvs = canvasRef.current;
      const g = glRef.current;
      const p = programRef.current;

      // Resize canvas to match display size
      const displayW = cvs.clientWidth;
      const displayH = cvs.clientHeight;
      if (cvs.width !== displayW || cvs.height !== displayH) {
        cvs.width = displayW;
        cvs.height = displayH;
        g.viewport(0, 0, displayW, displayH);
      }

      g.useProgram(p);

      // Set uniforms
      const timeLoc = g.getUniformLocation(p, 'u_time');
      const resLoc = g.getUniformLocation(p, 'u_resolution');

      const elapsed = isPaused
        ? pausedTimeRef.current
        : (Date.now() - startTimeRef.current) / 1000.0;

      if (!isPaused) {
        pausedTimeRef.current = elapsed;
      }

      if (timeLoc) g.uniform1f(timeLoc, elapsed);
      if (resLoc) g.uniform2f(resLoc, cvs.width, cvs.height);

      // Audio uniforms — always set if locations exist (defaults to 0 when audio off)
      updateAudioData();
      const bassLoc = g.getUniformLocation(p, 'u_bass');
      const midLoc = g.getUniformLocation(p, 'u_mid');
      const trebleLoc = g.getUniformLocation(p, 'u_treble');
      if (bassLoc) g.uniform1f(bassLoc, audioBassRef.current);
      if (midLoc) g.uniform1f(midLoc, audioMidRef.current);
      if (trebleLoc) g.uniform1f(trebleLoc, audioTrebleRef.current);

      // Set attribute
      const posLoc = g.getAttribLocation(p, 'a_position');
      g.enableVertexAttribArray(posLoc);
      g.vertexAttribPointer(posLoc, 2, g.FLOAT, false, 0, 0);

      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);

      // FPS tracking
      frameCountRef.current++;
      const now = Date.now();
      if (now - lastFpsUpdateRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (programRef.current && glRef.current) {
        glRef.current.deleteProgram(programRef.current);
        programRef.current = null;
      }
      glRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render loop reads isPaused from ref-like behavior via the state
  // We need to sync isPaused into a ref for the render loop
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Debounced recompile on code change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      recompile(code);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code, recompile]);

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    setCode(SHADER_PRESETS[index]!.fragmentShader);
    setError(null);
    setPromptResult(null);
    setPromptError(false);
  };

  const handleResetPreset = () => {
    if (selectedPreset >= 0 && selectedPreset < SHADER_PRESETS.length) {
      setCode(SHADER_PRESETS[selectedPreset]!.fragmentShader);
      setError(null);
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      // Resuming: adjust start time so elapsed continues from where it was
      startTimeRef.current = Date.now() - pausedTimeRef.current * 1000;
    }
    setIsPaused((prev: boolean) => !prev);
  };

  const handleFullscreen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isFullscreen) {
      canvas.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen((prev: boolean) => !prev);
  };

  const handleCopyLink = async () => {
    try {
      const encoded = btoa(encodeURIComponent(code));
      const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Copied!',
        description: 'Shareable link copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handlePromptSubmit = () => {
    const result = generateShader(promptInput);
    if (result) {
      setCode(result.code);
      setSelectedPreset(-1);
      setPromptResult(result);
      setPromptError(false);
      setError(null);
    } else {
      setPromptResult(null);
      setPromptError(true);
    }
  };

  const handleChipClick = (chip: string) => {
    setPromptInput(chip);
    const result = generateShader(chip);
    if (result) {
      setCode(result.code);
      setSelectedPreset(-1);
      setPromptResult(result);
      setPromptError(false);
      setError(null);
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <Container maxW="container.xl" py={8}>
      <SlideFade in offsetY={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack spacing={3} mb={4}>
              <Link as={NextLink} href="/labs">
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  size="sm"
                />
              </Link>
              <Badge colorScheme="pink" fontSize="sm" px={2} py={1}>
                Graphics
              </Badge>
            </HStack>

            <Heading as="h1" size="xl" mb={3}>
              Shader Playground
            </Heading>

            <Paragraph>
              Write GLSL fragment shaders and see them render in real time.
              GPU-powered procedural art in your browser.
            </Paragraph>
          </Box>

          {/* Natural Language Prompt */}
          <Box>
            <HStack spacing={2} mb={3}>
              <Text fontSize="lg">&#10024;</Text>
              <Text fontWeight="semibold" color={textColor}>
                Describe a shader
              </Text>
            </HStack>
            <Flex gap={2} mb={3}>
              <InputGroup flex={1}>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.500"
                  fontSize="sm"
                >
                  &gt;
                </InputLeftElement>
                <Input
                  value={promptInput}
                  onChange={(e: { target: { value: string } }) =>
                    setPromptInput(e.target.value)
                  }
                  onKeyDown={(e: { key: string }) => {
                    if (e.key === 'Enter') handlePromptSubmit();
                  }}
                  placeholder="Describe what you want to see... (e.g., 'neon heart', 'ocean waves', 'glowing torus')"
                  fontFamily="mono"
                  fontSize="sm"
                  _focus={{
                    borderColor: 'pink.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-pink-400)',
                  }}
                />
              </InputGroup>
              <Button
                colorScheme="pink"
                onClick={handlePromptSubmit}
                flexShrink={0}
              >
                Generate
              </Button>
            </Flex>
            <Flex justify="space-between" align="center" mb={2}>
              <Wrap spacing={2}>
                {QUICK_PROMPT_CHIPS.map((chip) => (
                  <WrapItem key={chip}>
                    <Badge
                      colorScheme="pink"
                      variant="subtle"
                      cursor="pointer"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      onClick={() => handleChipClick(chip)}
                      _hover={{ opacity: 0.8, transform: 'scale(1.05)' }}
                      transition="all 0.15s"
                    >
                      {chip}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
              <HStack spacing={1} flexShrink={0} ml={2}>
                <LockIcon boxSize={3} color="gray.500" />
                <Text fontSize="xs" color="gray.500">
                  Runs locally
                </Text>
              </HStack>
            </Flex>
            {promptResult && (
              <MotionBox
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge
                  colorScheme={promptResult.isGenerated ? 'cyan' : 'green'}
                  fontSize="sm"
                  px={2}
                  py={1}
                >
                  {promptResult.isGenerated
                    ? `Generated shader: ${promptResult.description}`
                    : `Matched: ${promptResult.description}`}
                </Badge>
              </MotionBox>
            )}
            {promptError && (
              <Text fontSize="sm" color="gray.500">
                No match found — try different words like shapes (sphere, heart,
                torus) or effects (fire, waves, noise)
              </Text>
            )}
          </Box>

          {/* Preset Selector */}
          <Box>
            <Text fontWeight="semibold" mb={3} color={textColor}>
              Presets
            </Text>
            <Wrap spacing={2}>
              {SHADER_PRESETS.map((preset, i) => {
                const cat = SHADER_CATEGORIES.find(
                  (c) => c.name === preset.category
                );
                return (
                  <WrapItem key={preset.name}>
                    <Tooltip label={preset.description} placement="top">
                      <Badge
                        colorScheme={cat?.color || 'gray'}
                        variant={selectedPreset === i ? 'solid' : 'subtle'}
                        cursor="pointer"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        onClick={() => handlePresetSelect(i)}
                        _hover={{ opacity: 0.8, transform: 'scale(1.05)' }}
                        transition="all 0.15s"
                      >
                        {preset.name}
                      </Badge>
                    </Tooltip>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Box>

          <Divider />

          {/* Main Editor + Preview */}
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={4}
            minH="500px"
          >
            {/* Code Editor */}
            <Box flex={1} minW={0}>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold" fontSize="sm" color={textColor}>
                  Fragment Shader
                </Text>
                <HStack spacing={1}>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleResetPreset}
                    isDisabled={
                      selectedPreset < 0 ||
                      selectedPreset >= SHADER_PRESETS.length
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleCopyLink}
                  >
                    Copy Link
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="pink"
                    onClick={() => recompile(code)}
                  >
                    Compile
                  </Button>
                </HStack>
              </HStack>
              <Flex
                bg="gray.900"
                borderRadius="md"
                overflow="hidden"
                border="1px solid"
                borderColor="gray.700"
                h={{ base: '350px', lg: '500px' }}
              >
                {/* Line numbers */}
                <Box
                  py={3}
                  px={2}
                  bg="gray.800"
                  borderRight="1px solid"
                  borderColor="gray.700"
                  overflowY="hidden"
                  userSelect="none"
                  minW="40px"
                >
                  <VStack spacing={0} align="flex-end">
                    {Array.from({ length: lineCount }, (_, i) => (
                      <Text
                        key={i}
                        fontSize="xs"
                        fontFamily="mono"
                        color="gray.500"
                        lineHeight="20px"
                      >
                        {i + 1}
                      </Text>
                    ))}
                  </VStack>
                </Box>
                {/* Textarea */}
                <Textarea
                  value={code}
                  onChange={(e: { target: { value: string } }) => setCode(e.target.value)}
                  fontFamily="mono"
                  fontSize="xs"
                  color="green.300"
                  bg="gray.900"
                  border="none"
                  resize="none"
                  h="100%"
                  py={3}
                  px={3}
                  lineHeight="20px"
                  spellCheck={false}
                  _focus={{ border: 'none', boxShadow: 'none' }}
                  _hover={{ border: 'none' }}
                  overflowY="auto"
                />
              </Flex>
              {/* Audio uniforms helper */}
              {audioEnabled && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  mt={2}
                >
                  <Text fontSize="xs" fontFamily="mono" color="gray.500">
                    Audio uniforms available: uniform float u_bass; // 0-1 low
                    freq | uniform float u_mid; // 0-1 mid freq | uniform float
                    u_treble; // 0-1 high freq
                  </Text>
                </MotionBox>
              )}
            </Box>

            {/* Preview Canvas */}
            <Box flex={1} minW={0}>
              <HStack justify="space-between" mb={2}>
                <HStack spacing={2}>
                  <Text fontWeight="semibold" fontSize="sm" color={textColor}>
                    Preview
                  </Text>
                  <Badge colorScheme="green" fontSize="xs">
                    {fps} FPS
                  </Badge>
                  {compileTimeMs !== null && (
                    <Badge colorScheme="purple" fontSize="xs">
                      {compileTimeMs}ms compile
                    </Badge>
                  )}
                </HStack>
                <HStack spacing={1}>
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme={audioEnabled ? 'red' : 'cyan'}
                    onClick={handleToggleAudio}
                  >
                    {audioEnabled ? 'Audio Off' : 'Audio Reactive'}
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme={isPaused ? 'green' : 'yellow'}
                    onClick={handleTogglePause}
                  >
                    {isPaused ? 'Play' : 'Pause'}
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleFullscreen}
                  >
                    Fullscreen
                  </Button>
                </HStack>
              </HStack>
              <Box
                bg="black"
                borderRadius="md"
                overflow="hidden"
                border="1px solid"
                borderColor="gray.700"
                h={{ base: '300px', lg: '500px' }}
                position="relative"
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                  }}
                />
              </Box>
              {/* Audio error */}
              {audioError && (
                <Text fontSize="xs" color="red.400" mt={1}>
                  Microphone error: {audioError}
                </Text>
              )}
            </Box>
          </Flex>

          {/* Error Display */}
          {error && (
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              bg="red.900"
              border="1px solid"
              borderColor="red.500"
              borderRadius="md"
              p={4}
            >
              <Text
                fontFamily="mono"
                fontSize="sm"
                color="red.200"
                whiteSpace="pre-wrap"
              >
                {error}
              </Text>
            </MotionBox>
          )}

          {/* Uniform Controls */}
          <Box bg={cardBg} p={4} borderRadius="md" shadow="sm">
            <Text fontWeight="semibold" mb={2}>
              Uniforms
            </Text>
            <Wrap spacing={6}>
              <WrapItem>
                <HStack>
                  <Text fontSize="sm" fontFamily="mono" color={textColor}>
                    u_time:
                  </Text>
                  <Badge colorScheme="pink" fontFamily="mono">
                    {pausedTimeRef.current.toFixed(2)}s
                  </Badge>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme={isPaused ? 'green' : 'yellow'}
                    onClick={handleTogglePause}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </HStack>
              </WrapItem>
              <WrapItem>
                <HStack>
                  <Text fontSize="sm" fontFamily="mono" color={textColor}>
                    u_resolution:
                  </Text>
                  <Badge colorScheme="purple" fontFamily="mono">
                    {canvasRef.current?.width || 0} x{' '}
                    {canvasRef.current?.height || 0}
                  </Badge>
                </HStack>
              </WrapItem>
              {audioEnabled && (
                <>
                  <WrapItem>
                    <HStack>
                      <Text fontSize="sm" fontFamily="mono" color={textColor}>
                        u_bass:
                      </Text>
                      <Badge colorScheme="orange" fontFamily="mono">
                        {audioBassRef.current.toFixed(3)}
                      </Badge>
                    </HStack>
                  </WrapItem>
                  <WrapItem>
                    <HStack>
                      <Text fontSize="sm" fontFamily="mono" color={textColor}>
                        u_mid:
                      </Text>
                      <Badge colorScheme="yellow" fontFamily="mono">
                        {audioMidRef.current.toFixed(3)}
                      </Badge>
                    </HStack>
                  </WrapItem>
                  <WrapItem>
                    <HStack>
                      <Text fontSize="sm" fontFamily="mono" color={textColor}>
                        u_treble:
                      </Text>
                      <Badge colorScheme="cyan" fontFamily="mono">
                        {audioTrebleRef.current.toFixed(3)}
                      </Badge>
                    </HStack>
                  </WrapItem>
                </>
              )}
            </Wrap>
          </Box>

          <Divider />

          {/* How it works */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Heading as="h2" size="md" mb={4}>
              How It Works
            </Heading>
            <VStack spacing={3} align="stretch">
              <Box bg={cardBg} p={4} borderRadius="md" shadow="sm">
                <Text fontWeight="semibold" mb={1}>
                  Fragment Shaders
                </Text>
                <Text fontSize="sm" color={textColor}>
                  A fragment shader is a small program that runs on the GPU for
                  every pixel on screen. It receives the pixel coordinate (
                  <code>gl_FragCoord</code>) and outputs a color (
                  <code>gl_FragColor</code>). Because the GPU runs thousands of
                  these in parallel, complex mathematical patterns render in real
                  time.
                </Text>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="md" shadow="sm">
                <Text fontWeight="semibold" mb={1}>
                  Uniforms
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Uniforms are values passed from JavaScript to the shader each
                  frame. Here we provide <code>u_time</code> (seconds since
                  start) for animation and <code>u_resolution</code> (canvas
                  dimensions in pixels) so the shader can normalize coordinates.
                  When audio mode is enabled, <code>u_bass</code>,{' '}
                  <code>u_mid</code>, and <code>u_treble</code> provide
                  real-time FFT frequency data from your microphone.
                </Text>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="md" shadow="sm">
                <Text fontWeight="semibold" mb={1}>
                  The Rendering Pipeline
                </Text>
                <Text fontSize="sm" color={textColor}>
                  A full-screen quad (two triangles) is drawn each frame. The
                  vertex shader positions the quad to cover the entire canvas.
                  The fragment shader then computes the color for each pixel.
                  JavaScript updates the uniforms and calls{' '}
                  <code>requestAnimationFrame</code> to keep the loop running at
                  display refresh rate.
                </Text>
              </Box>
            </VStack>
          </MotionBox>
        </VStack>
      </SlideFade>
    </Container>
  );
}
