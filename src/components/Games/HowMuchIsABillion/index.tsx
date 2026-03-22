import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  useColorModeValue,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionText = motion(Text);

interface BiddingNPC {
  name: string;
  emoji: string;
  bid: number;
}

const NPCS: BiddingNPC[] = [
  { name: 'Foreign Investment LLC', emoji: '🏢', bid: 0 },
  { name: 'Guy Who Sold Bitcoin in 2021', emoji: '🤑', bid: 0 },
  { name: 'Tech Bro with "Passive Income"', emoji: '💻', bid: 0 },
  { name: 'Boomer Who Bought in 1985', emoji: '👴', bid: 0 },
  { name: 'Mysterious Numbered Company', emoji: '🕵️', bid: 0 },
];

const COMPARISONS = [
  { amount: 1, label: '$1', visual: '🪙', description: 'A single dollar. You can almost buy a coffee. Almost.' },
  { amount: 10, label: '$10', visual: '🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙', description: 'Ten dollars. A mediocre lunch in Vancouver.' },
  { amount: 100, label: '$100', visual: '💵', description: 'One hundred dollars. A single bag of groceries if you shop carefully and cry a little.' },
  { amount: 1000, label: '$1,000', visual: '💵💵💵💵💵💵💵💵💵💵', description: 'One thousand dollars. About half a month\'s rent for a closet in Kitsilano.' },
  { amount: 10_000, label: '$10,000', visual: '💰', description: 'Ten thousand dollars. You could buy a used Honda Civic. Or one month of Vancouver parking.' },
  { amount: 100_000, label: '$100,000', visual: '💰💰💰', description: 'One hundred thousand dollars. A year\'s salary for many Canadians. A down payment on literally nothing in Vancouver.' },
  { amount: 1_000_000, label: '$1,000,000', visual: '🏠', description: 'One million dollars. In most cities, life-changing wealth. In Vancouver...' },
  { amount: 1_000_000_000, label: '$1,000,000,000', visual: '🌍', description: 'One BILLION dollars. If you earned $5,000/day since Columbus sailed to America... you still wouldn\'t have a billion.' },
  { amount: 1_000_000_000_000, label: '$1,000,000,000,000', visual: '🌌', description: 'One TRILLION dollars. The number has become abstract. You are now thinking in cosmic terms.' },
];

const VANCOUVER_LISTINGS = [
  { name: '1BR Condo, 480 sqft, Yaletown', price: 689000, description: 'No parking. No storage. "Cozy."', emoji: '🏢' },
  { name: 'Parking Spot, Downtown', price: 120000, description: 'Just the spot. Not a car. Not a condo. A rectangle of concrete.', emoji: '🅿️' },
  { name: '2BR "Fixer Upper", East Van', price: 1450000, description: 'The ceiling is sagging. The agent called it "character."', emoji: '🏚️' },
  { name: 'Detached Home, Dunbar', price: 3200000, description: 'Built in 1962. Unchanged since. "Location, location, location."', emoji: '🏡' },
  { name: 'Tiny House on Wheels', price: 89000, description: 'Technically not real estate. Technically not legal. Technically a home.', emoji: '🚐' },
];

export default function HowMuchIsABillion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [biddingActive, setBiddingActive] = useState(false);
  const [selectedListing, setSelectedListing] = useState(0);
  const [playerBid, setPlayerBid] = useState(0);
  const [npcBids, setNpcBids] = useState<BiddingNPC[]>([]);
  const [bidResult, setBidResult] = useState<string | null>(null);
  const [scrollSection, setScrollSection] = useState(0);

  const bg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('green.600', 'green.400');

  // Track scroll position to determine section
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setScrollSection(Math.floor(v * COMPARISONS.length));
    });
    return unsub;
  }, [scrollYProgress]);

  const startBidding = useCallback((listingIdx: number) => {
    const listing = VANCOUVER_LISTINGS[listingIdx]!;
    setSelectedListing(listingIdx);
    setPlayerBid(listing.price);
    setBiddingActive(true);
    setBidResult(null);

    // Generate NPC bids
    const npcs = NPCS.map((npc) => ({
      ...npc,
      bid: listing.price + Math.floor(Math.random() * listing.price * 0.3),
    }));
    setNpcBids(npcs);
  }, []);

  const submitBid = () => {
    const listing = VANCOUVER_LISTINGS[selectedListing]!;
    const maxNpc = Math.max(...npcBids.map((n) => n.bid));
    const winner = npcBids.find((n) => n.bid === maxNpc);

    if (playerBid > maxNpc) {
      setBidResult(`You won! But you paid $${playerBid.toLocaleString()} for ${listing.name}. Was it worth it? (No.)`);
    } else {
      setBidResult(`Outbid by ${winner?.name ?? 'someone'} (${winner?.emoji ?? ''}) at $${maxNpc.toLocaleString()}. Welcome to Vancouver.`);
    }
  };

  return (
    <Box
      ref={containerRef}
      h="70vh"
      overflowY="auto"
      position="relative"
      css={{
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': { bg: 'gray.400', borderRadius: '3px' },
      }}
    >
      {/* Progress indicator */}
      <Box position="sticky" top={0} zIndex={10} h="3px">
        <MotionBox
          h="3px"
          bg="green.400"
          style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        />
      </Box>

      <VStack spacing={0} align="stretch" pb={20}>
        {COMPARISONS.map((comp, idx) => (
          <Box key={comp.amount} minH="70vh" display="flex" alignItems="center" position="relative">
            <Container maxW="container.md">
              <MotionBox
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                <VStack spacing={4} textAlign="center" py={10}>
                  <Text fontSize="6xl" lineHeight={1}>
                    {comp.visual}
                  </Text>
                  <Heading
                    size="2xl"
                    color={accentColor}
                    fontFamily="mono"
                  >
                    {comp.label}
                  </Heading>
                  <Text
                    fontSize="lg"
                    color={subtleText}
                    maxW="500px"
                  >
                    {comp.description}
                  </Text>

                  {/* Special interactive section at $1M */}
                  {comp.amount === 1_000_000 && (
                    <Box w="100%" mt={6}>
                      <Heading size="sm" mb={4}>
                        🏠 Try to buy a home in Vancouver with $1M
                      </Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                        {VANCOUVER_LISTINGS.map((listing, i) => (
                          <Box
                            key={listing.name}
                            bg={cardBg}
                            borderRadius="lg"
                            p={4}
                            cursor="pointer"
                            onClick={() => startBidding(i)}
                            _hover={{ shadow: 'md' }}
                            borderWidth="1px"
                            borderColor={selectedListing === i && biddingActive ? 'green.400' : 'transparent'}
                          >
                            <HStack justify="space-between" mb={1}>
                              <Text fontSize="sm" fontWeight="bold">
                                {listing.emoji} {listing.name}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color={subtleText}>
                              {listing.description}
                            </Text>
                            <Badge colorScheme="red" mt={2}>
                              ${listing.price.toLocaleString()}
                            </Badge>
                          </Box>
                        ))}
                      </SimpleGrid>

                      <AnimatePresence>
                        {biddingActive && (
                          <MotionBox
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            mt={4}
                            bg={cardBg}
                            borderRadius="lg"
                            p={4}
                          >
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                              Bidding War for: {VANCOUVER_LISTINGS[selectedListing]?.name}
                            </Text>
                            <VStack spacing={2} mb={3}>
                              {npcBids.map((npc) => (
                                <HStack key={npc.name} w="100%" justify="space-between" fontSize="xs">
                                  <Text>{npc.emoji} {npc.name}</Text>
                                  <Badge colorScheme="red">${npc.bid.toLocaleString()}</Badge>
                                </HStack>
                              ))}
                            </VStack>
                            <HStack mb={3}>
                              <Text fontSize="sm">Your bid:</Text>
                              <Button
                                size="xs"
                                onClick={() => setPlayerBid((b) => b + 50000)}
                              >
                                +$50K
                              </Button>
                              <Button
                                size="xs"
                                onClick={() => setPlayerBid((b) => b + 100000)}
                              >
                                +$100K
                              </Button>
                              <Badge colorScheme="green" fontSize="sm">
                                ${playerBid.toLocaleString()}
                              </Badge>
                            </HStack>
                            {!bidResult ? (
                              <Button size="sm" colorScheme="green" onClick={submitBid}>
                                Submit Bid
                              </Button>
                            ) : (
                              <Text fontSize="sm" color={subtleText}>
                                {bidResult}
                              </Text>
                            )}
                          </MotionBox>
                        )}
                      </AnimatePresence>
                    </Box>
                  )}

                  {/* Fun facts at $1B */}
                  {comp.amount === 1_000_000_000 && (
                    <VStack spacing={2} mt={4} fontSize="sm" color={subtleText}>
                      <Text>💡 $1B in $100 bills weighs 10 tons.</Text>
                      <Text>💡 If you spent $1,000/hour, it would take 114 years to spend $1B.</Text>
                      <Text>💡 1 billion seconds ago was 1994.</Text>
                      <Text>💡 There are ~2,600 billionaires. None of them got there by saving.</Text>
                    </VStack>
                  )}

                  {/* Punchline at $1T */}
                  {comp.amount === 1_000_000_000_000 && (
                    <VStack spacing={3} mt={4}>
                      <Text fontSize="sm" color={subtleText}>
                        $1 trillion is roughly the GDP of the Netherlands.
                      </Text>
                      <Text fontSize="sm" color={subtleText}>
                        Or about 1.4 million Vancouver condos.
                      </Text>
                      <Box bg={cardBg} borderRadius="lg" p={4} maxW="400px">
                        <Text fontSize="sm" fontWeight="bold" mb={2}>
                          Meanwhile, your digital existence...
                        </Text>
                        <Text fontSize="xs" color={subtleText}>
                          The data you&apos;ve generated for tech companies — every click,
                          scroll, like, search, and pause — has been estimated at
                          $1,000-$5,000 per year per user.
                        </Text>
                        <Text fontSize="xs" color={subtleText} mt={2}>
                          You scrolled through this entire page for free.
                          Somewhere, an ad algorithm is grateful.
                        </Text>
                      </Box>
                    </VStack>
                  )}
                </VStack>
              </MotionBox>
            </Container>
          </Box>
        ))}

        {/* Final section */}
        <Box minH="50vh" display="flex" alignItems="center">
          <Container maxW="container.md" textAlign="center">
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Heading size="md" mb={4}>
                You scrolled from $1 to $1,000,000,000,000.
              </Heading>
              <Text color={subtleText}>
                The difference between a million and a billion is approximately a billion.
              </Text>
            </MotionBox>
          </Container>
        </Box>
      </VStack>
    </Box>
  );
}
