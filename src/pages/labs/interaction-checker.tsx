import { useState, useMemo } from 'react';
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
  List,
  ListItem,
  Flex,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import Paragraph from '@components/Paragraph';
import {
  MEDICATIONS,
  SUPPLEMENTS,
  INTERACTIONS,
  findInteractions,
} from '@data/interactions';

const MotionBox = motion(Box);

const RISK_COLORS: Record<string, string> = {
  High: 'red',
  Moderate: 'yellow',
  Low: 'green',
};

const RISK_ICONS: Record<string, string> = {
  High: '⚠️',
  Moderate: '⚡',
  Low: '✅',
};

function AutocompleteInput({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const highlightBg = useColorModeValue('green.50', 'green.900');
  const labelColor = useColorModeValue('gray.500', 'gray.400');

  const filtered = useMemo(() => {
    if (!inputValue) return options;
    return options.filter((o) =>
      o.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  return (
    <Box position="relative" w="100%">
      <Text fontSize="xs" fontWeight="bold" color={labelColor} mb={1} textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
      <Input
        placeholder={placeholder}
        value={value || inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange('');
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        bg={bg}
        borderColor={borderColor}
        size="lg"
        fontSize="md"
        _focus={{
          borderColor: 'green.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
        }}
      />
      {isOpen && filtered.length > 0 && (
        <List
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg={bg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          maxH="200px"
          overflowY="auto"
          zIndex={10}
          mt={1}
          boxShadow="lg"
        >
          {filtered.map((option) => (
            <ListItem
              key={option}
              px={4}
              py={2}
              cursor="pointer"
              bg={value === option ? highlightBg : 'transparent'}
              _hover={{ bg: hoverBg }}
              onMouseDown={() => {
                onChange(option);
                setInputValue('');
                setIsOpen(false);
              }}
              fontSize="sm"
            >
              {option}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

function InteractionChecker() {
  const [medication, setMedication] = useState('');
  const [supplement, setSupplement] = useState('');

  const interaction = useMemo(() => {
    if (!medication || !supplement) return null;
    return findInteractions(medication, supplement);
  }, [medication, supplement]);

  const hasSelection = medication && supplement;

  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const resultBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dimText = useColorModeValue('gray.500', 'gray.400');

  return (
    <>
      <NextSeo
        title="Supplement Interaction Checker | Labs | Adam Hultman"
        description="Check for interactions between common medications and supplements. Powered by evidence-based data."
        canonical="https://hultman.dev/labs/interaction-checker"
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
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                Interactive Demo
              </Badge>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '32px', lg: '36px' }}
              mb={3}
            >
              💊 Interaction Checker
            </Heading>
            <Paragraph fontSize="lg" mb={8}>
              Check if your supplements interact with your medications.
              Powered by evidence-based pharmacological data.
            </Paragraph>

            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={{ base: 4, md: 8 }}
              mb={8}
            >
              <VStack spacing={6} align="stretch">
                <AutocompleteInput
                  label="I take"
                  placeholder="Search medication..."
                  options={MEDICATIONS}
                  value={medication}
                  onChange={setMedication}
                />
                <AutocompleteInput
                  label="I&rsquo;m considering"
                  placeholder="Search supplement..."
                  options={SUPPLEMENTS}
                  value={supplement}
                  onChange={setSupplement}
                />
              </VStack>
            </Box>

            <AnimatePresence mode="wait">
              {hasSelection && (
                <MotionBox
                  key={`${medication}-${supplement}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {interaction ? (
                    <Box
                      bg={resultBg}
                      borderWidth="2px"
                      borderColor={`${RISK_COLORS[interaction.risk]}.400`}
                      borderRadius="xl"
                      p={{ base: 4, md: 8 }}
                      mb={8}
                    >
                      <Flex align="center" mb={4}>
                        <Text fontSize="2xl" mr={3}>
                          {RISK_ICONS[interaction.risk]}
                        </Text>
                        <Box>
                          <Badge
                            colorScheme={RISK_COLORS[interaction.risk]}
                            fontSize="md"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {interaction.risk} Risk
                          </Badge>
                        </Box>
                      </Flex>

                      <Divider my={4} />

                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={dimText}
                            textTransform="uppercase"
                            letterSpacing="wider"
                            mb={1}
                          >
                            Mechanism
                          </Text>
                          <Text fontSize="sm">
                            {interaction.mechanism}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={dimText}
                            textTransform="uppercase"
                            letterSpacing="wider"
                            mb={1}
                          >
                            Recommendation
                          </Text>
                          <Text fontSize="sm">
                            {interaction.recommendation}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  ) : (
                    <Box
                      bg={resultBg}
                      borderWidth="2px"
                      borderColor="green.400"
                      borderRadius="xl"
                      p={{ base: 4, md: 8 }}
                      mb={8}
                      textAlign="center"
                    >
                      <Text fontSize="2xl" mb={2}>✅</Text>
                      <Text fontWeight="bold" mb={1}>
                        No known interaction found
                      </Text>
                      <Text fontSize="sm" color={dimText}>
                        This combination does not appear in our database of common interactions.
                        Always consult your healthcare provider before starting new supplements.
                      </Text>
                    </Box>
                  )}
                </MotionBox>
              )}
            </AnimatePresence>

            <Divider my={8} />

            <Box mb={8}>
              <Heading as="h2" size="sm" mb={3}>
                How it works
              </Heading>
              <Text fontSize="sm" color={dimText} mb={3}>
                This checker uses a curated database of {INTERACTIONS.length} clinically
                significant supplement-drug interactions, sourced from pharmacological
                literature and drug interaction databases. Each interaction includes
                the biochemical mechanism and evidence-based recommendations.
              </Text>
              <Text fontSize="sm" color={dimText} mb={3}>
                <strong>Disclaimer:</strong> This is an educational tool, not medical advice.
                Always consult a healthcare professional before making changes to your
                medication or supplement regimen.
              </Text>
              <HStack spacing={4} fontSize="xs" color={dimText}>
                <Text>Built with: Next.js · Chakra UI · Framer Motion</Text>
                <Link
                  href="https://github.com/ACHultman/achultman-web"
                  isExternal
                  color="green.400"
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

export default InteractionChecker;
