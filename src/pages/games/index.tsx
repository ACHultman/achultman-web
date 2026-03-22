import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  SlideFade,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import Paragraph from '@components/Paragraph';
import GameCard from '@components/Games/GameCard';
import { GAME_METADATA } from '../../data/gamesData';

function Games() {
  const router = useRouter();
  const dimText = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <NextSeo
        title="Arcade"
        description="Comedy-themed browser games that escalate way too fast. Hunt emotional circles, flip gravity, survive Vancouver rain, and destroy a pristine office."
        openGraph={{
          title: 'Adam Hultman | Arcade',
          description:
            'Comedy-themed browser games that escalate way too fast.',
          url: 'https://hultman.dev/games',
        }}
        canonical="https://hultman.dev/games"
      />
      <Container maxW="container.lg">
        <SlideFade in={true} offsetY={80}>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: '28px', md: '36px', lg: '42px' }}
              mb={3}
            >
              Arcade
            </Heading>
            <Paragraph fontSize="lg" mb={2}>
              Games that start simple and escalate way too fast.
            </Paragraph>
            <Text fontSize="sm" color={dimText} mb={10}>
              No objectives were respected. No frameworks were harmed.
              Your productivity was, though.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {GAME_METADATA.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={i}
                  onClick={() => router.push(`/games/${game.id}`)}
                />
              ))}
            </SimpleGrid>
          </Box>
        </SlideFade>
      </Container>
    </>
  );
}

export default Games;
