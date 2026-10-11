import { ArrowBackIcon, LockIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Flex,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    SlideFade,
    Text,
    Textarea,
    Tooltip,
    VStack,
    Wrap,
    WrapItem,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { PageSeo } from '@components/Editorial';
import Paragraph from '@components/Paragraph';
import type { GeneratedShader } from '@data/shaderData';
import {
    QUICK_PROMPT_CHIPS,
    SHADER_CATEGORIES,
    SHADER_PRESETS,
    generateShader,
} from '@data/shaderData';
import { motion, useReducedMotion } from 'framer-motion';
import NextLink from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { labPages } from '../../data/labPages';
import { useShaderCanvas } from '../../hooks/useShaderCanvas';

const subscribeHash = (notify: () => void) => {
    window.addEventListener('hashchange', notify);
    return () => window.removeEventListener('hashchange', notify);
};
const getHash = () => window.location.hash;
const serverHash = () => '';
function decodeHash(hash: string) {
    if (!hash || hash.length > 64001) return null;
    try {
        const value = decodeURIComponent(atob(hash.slice(1)));
        return value.length <= 16000 ? value : null;
    } catch {
        return null;
    }
}

const MotionBox = motion(Box);

export default function ShaderPlayground() {
    const hash = useSyncExternalStore(subscribeHash, getHash, serverHash);
    const importedCode = decodeHash(hash);
    const [selected, setSelectedPreset] = useState<number | null>(null);
    const selectedPreset = selected ?? (importedCode ? -1 : 0);
    const [editedCode, setCode] = useState<string | null>(null);
    const code =
        editedCode ?? importedCode ?? SHADER_PRESETS[0]!.fragmentShader;
    const prefersReducedMotion = useReducedMotion();
    const [pausedOverride, setIsPaused] = useState<boolean | null>(null);
    const isPaused = pausedOverride ?? prefersReducedMotion ?? false;
    const {
        canvasRef,
        error,
        setError,
        fps,
        elapsed,
        width,
        height,
        bands,
        recompile,
        compileTimeMs,
        audioEnabled,
        audioError,
        handleToggleAudio,
    } = useShaderCanvas(code, isPaused);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [promptInput, setPromptInput] = useState('');
    const [promptResult, setPromptResult] = useState<GeneratedShader | null>(
        null
    );
    const [promptError, setPromptError] = useState(false);

    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                window.history.replaceState(
                    null,
                    '',
                    `#${btoa(encodeURIComponent(code))}`
                );
            } catch {
                /* Leave the URL unchanged if it cannot represent this shader. */
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [code]);

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

    const handleTogglePause = () => setIsPaused(!isPaused);

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
            <PageSeo {...labPages['shader-playground']} />
            <SlideFade in offsetY={20}>
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <Box>
                        <HStack spacing={3} mb={4}>
                            <IconButton
                                as={NextLink}
                                href="/labs"
                                minH="44px"
                                minW="44px"
                                aria-label="Go back"
                                icon={<ArrowBackIcon />}
                                variant="ghost"
                                size="sm"
                            />
                            <Badge
                                colorScheme="pink"
                                fontSize="sm"
                                px={2}
                                py={1}
                            >
                                Graphics
                            </Badge>
                        </HStack>

                        <Heading as="h1" size="xl" mb={3}>
                            Shader Playground
                        </Heading>

                        <Paragraph>
                            Write GLSL fragment shaders and see them render in
                            real time. GPU-powered procedural art in your
                            browser.
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
                                    color="accessible.gray"
                                    fontSize="sm"
                                >
                                    &gt;
                                </InputLeftElement>
                                <Input
                                    value={promptInput}
                                    onChange={(e: {
                                        target: { value: string };
                                    }) => setPromptInput(e.target.value)}
                                    onKeyDown={(e: { key: string }) => {
                                        if (e.key === 'Enter')
                                            handlePromptSubmit();
                                    }}
                                    placeholder="Describe what you want to see... (e.g., 'neon heart', 'ocean waves', 'glowing torus')"
                                    fontFamily="mono"
                                    fontSize="sm"
                                    _focus={{
                                        borderColor: 'pink.400',
                                        boxShadow:
                                            '0 0 0 1px var(--chakra-colors-pink-400)',
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
                                            as="button"
                                            type="button"
                                            colorScheme="pink"
                                            variant="subtle"
                                            cursor="pointer"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            fontSize="xs"
                                            onClick={() =>
                                                handleChipClick(chip)
                                            }
                                            _hover={{
                                                opacity: 0.8,
                                                transform: 'scale(1.05)',
                                            }}
                                            transition="all 0.15s"
                                        >
                                            {chip}
                                        </Badge>
                                    </WrapItem>
                                ))}
                            </Wrap>
                            <HStack spacing={1} flexShrink={0} ml={2}>
                                <LockIcon boxSize={3} color="accessible.gray" />
                                <Text fontSize="xs" color="accessible.gray">
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
                                    colorScheme={
                                        promptResult.isGenerated
                                            ? 'cyan'
                                            : 'green'
                                    }
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
                            <Text fontSize="sm" color="accessible.gray">
                                No match found — try different words like shapes
                                (sphere, heart, torus) or effects (fire, waves,
                                noise)
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
                                        <Tooltip
                                            label={preset.description}
                                            placement="top"
                                        >
                                            <Badge
                                                as="button"
                                                type="button"
                                                colorScheme={
                                                    cat?.color || 'gray'
                                                }
                                                variant={
                                                    selectedPreset === i
                                                        ? 'solid'
                                                        : 'subtle'
                                                }
                                                cursor="pointer"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="sm"
                                                onClick={() =>
                                                    handlePresetSelect(i)
                                                }
                                                _hover={{
                                                    opacity: 0.8,
                                                    transform: 'scale(1.05)',
                                                }}
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
                                <Text
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    color={textColor}
                                >
                                    Fragment Shader
                                </Text>
                                <HStack spacing={1}>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={handleResetPreset}
                                        isDisabled={
                                            selectedPreset < 0 ||
                                            selectedPreset >=
                                                SHADER_PRESETS.length
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
                                        {Array.from(
                                            { length: lineCount },
                                            (_, i) => (
                                                <Text
                                                    key={i}
                                                    fontSize="xs"
                                                    fontFamily="mono"
                                                    color="gray.400"
                                                    lineHeight="20px"
                                                >
                                                    {i + 1}
                                                </Text>
                                            )
                                        )}
                                    </VStack>
                                </Box>
                                {/* Textarea */}
                                <Textarea
                                    maxLength={16000}
                                    aria-label="Fragment shader source code"
                                    value={code}
                                    onChange={(e: {
                                        target: { value: string };
                                    }) => setCode(e.target.value)}
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
                                    _focus={{
                                        border: 'none',
                                        boxShadow: 'none',
                                    }}
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
                                    <Text
                                        fontSize="xs"
                                        fontFamily="mono"
                                        color="accessible.gray"
                                    >
                                        Audio uniforms available: uniform float
                                        u_bass; // 0-1 low freq | uniform float
                                        u_mid; // 0-1 mid freq | uniform float
                                        u_treble; // 0-1 high freq
                                    </Text>
                                </MotionBox>
                            )}
                        </Box>

                        {/* Preview Canvas */}
                        <Box flex={1} minW={0}>
                            <HStack justify="space-between" mb={2}>
                                <HStack spacing={2}>
                                    <Text
                                        fontWeight="semibold"
                                        fontSize="sm"
                                        color={textColor}
                                    >
                                        Preview
                                    </Text>
                                    <Badge colorScheme="green" fontSize="xs">
                                        {fps} FPS
                                    </Badge>
                                    {compileTimeMs !== null && (
                                        <Badge
                                            colorScheme="purple"
                                            fontSize="xs"
                                        >
                                            {compileTimeMs}ms compile
                                        </Badge>
                                    )}
                                </HStack>
                                <HStack spacing={1}>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        colorScheme={
                                            audioEnabled ? 'red' : 'cyan'
                                        }
                                        onClick={handleToggleAudio}
                                    >
                                        {audioEnabled
                                            ? 'Audio Off'
                                            : 'Audio Reactive'}
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        colorScheme={
                                            isPaused ? 'green' : 'yellow'
                                        }
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
                                    role="img"
                                    aria-label="Live preview of the fragment shader source"
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
                                <Text
                                    fontSize="xs"
                                    color="accessible.red"
                                    mt={1}
                                >
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
                                    <Text
                                        fontSize="sm"
                                        fontFamily="mono"
                                        color={textColor}
                                    >
                                        u_time:
                                    </Text>
                                    <Badge
                                        as="output"
                                        aria-label="Shader time"
                                        aria-live="off"
                                        colorScheme="pink"
                                        fontFamily="mono"
                                    >
                                        {elapsed.toFixed(2)}s
                                    </Badge>
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        colorScheme={
                                            isPaused ? 'green' : 'yellow'
                                        }
                                        onClick={handleTogglePause}
                                    >
                                        {isPaused ? 'Resume' : 'Pause'}
                                    </Button>
                                </HStack>
                            </WrapItem>
                            <WrapItem>
                                <HStack>
                                    <Text
                                        fontSize="sm"
                                        fontFamily="mono"
                                        color={textColor}
                                    >
                                        u_resolution:
                                    </Text>
                                    <Badge
                                        colorScheme="purple"
                                        fontFamily="mono"
                                    >
                                        {width} x {height}
                                    </Badge>
                                </HStack>
                            </WrapItem>
                            {audioEnabled && (
                                <>
                                    <WrapItem>
                                        <HStack>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="mono"
                                                color={textColor}
                                            >
                                                u_bass:
                                            </Text>
                                            <Badge
                                                colorScheme="orange"
                                                fontFamily="mono"
                                            >
                                                {bands.bass.toFixed(3)}
                                            </Badge>
                                        </HStack>
                                    </WrapItem>
                                    <WrapItem>
                                        <HStack>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="mono"
                                                color={textColor}
                                            >
                                                u_mid:
                                            </Text>
                                            <Badge
                                                colorScheme="yellow"
                                                fontFamily="mono"
                                            >
                                                {bands.mid.toFixed(3)}
                                            </Badge>
                                        </HStack>
                                    </WrapItem>
                                    <WrapItem>
                                        <HStack>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="mono"
                                                color={textColor}
                                            >
                                                u_treble:
                                            </Text>
                                            <Badge
                                                colorScheme="cyan"
                                                fontFamily="mono"
                                            >
                                                {bands.treble.toFixed(3)}
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
                            <Box
                                bg={cardBg}
                                p={4}
                                borderRadius="md"
                                shadow="sm"
                            >
                                <Text fontWeight="semibold" mb={1}>
                                    Fragment Shaders
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    A fragment shader is a small program that
                                    runs on the GPU for every pixel on screen.
                                    It receives the pixel coordinate (
                                    <code>gl_FragCoord</code>) and outputs a
                                    color (<code>gl_FragColor</code>). Because
                                    the GPU runs thousands of these in parallel,
                                    complex mathematical patterns render in real
                                    time.
                                </Text>
                            </Box>
                            <Box
                                bg={cardBg}
                                p={4}
                                borderRadius="md"
                                shadow="sm"
                            >
                                <Text fontWeight="semibold" mb={1}>
                                    Uniforms
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    Uniforms are values passed from JavaScript
                                    to the shader each frame. Here we provide{' '}
                                    <code>u_time</code> (seconds since start)
                                    for animation and <code>u_resolution</code>{' '}
                                    (canvas dimensions in pixels) so the shader
                                    can normalize coordinates. When audio mode
                                    is enabled, <code>u_bass</code>,{' '}
                                    <code>u_mid</code>, and{' '}
                                    <code>u_treble</code> provide real-time FFT
                                    frequency data from your microphone.
                                </Text>
                            </Box>
                            <Box
                                bg={cardBg}
                                p={4}
                                borderRadius="md"
                                shadow="sm"
                            >
                                <Text fontWeight="semibold" mb={1}>
                                    The Rendering Pipeline
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    A full-screen quad (two triangles) is drawn
                                    each frame. The vertex shader positions the
                                    quad to cover the entire canvas. The
                                    fragment shader then computes the color for
                                    each pixel. JavaScript updates the uniforms
                                    and calls <code>requestAnimationFrame</code>{' '}
                                    to keep the loop running at display refresh
                                    rate.
                                </Text>
                            </Box>
                        </VStack>
                    </MotionBox>
                </VStack>
            </SlideFade>
        </Container>
    );
}
