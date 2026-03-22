import { useState } from 'react';
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
import dynamic from 'next/dynamic';

import Paragraph from '@components/Paragraph';
import GameCard from '@components/Games/GameCard';
import GameModal from '@components/Games/GameModal';
import { GAME_METADATA } from '../data/gamesData';

const DeployButtonMasher = dynamic(
  () => import('@components/Games/DeployButtonMasher'),
  { ssr: false }
);
const BugWhacker = dynamic(() => import('@components/Games/BugWhacker'), {
  ssr: false,
});
const StandupExcuseGenerator = dynamic(
  () => import('@components/Games/StandupExcuseGenerator'),
  { ssr: false }
);
const CodeReviewRoulette = dynamic(
  () => import('@components/Games/CodeReviewRoulette'),
  { ssr: false }
);

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  'deploy-masher': DeployButtonMasher,
  'bug-whacker': BugWhacker,
  'standup-excuse': StandupExcuseGenerator,
  'code-review': CodeReviewRoulette,
};

function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const dimText = useColorModeValue('gray.600', 'gray.400');

  const selected = GAME_METADATA.find((g) => g.id === selectedGame);
  const GameComponent = selectedGame ? GAME_COMPONENTS[selectedGame] : null;

  return (
    <>
      <NextSeo
        title="Arcade"
        description="Comedy-themed browser mini-games for developers. Deploy to production, whack bugs, generate standup excuses, and review suspicious code."
        openGraph={{
          title: 'Adam Hultman | Arcade',
          description:
            'Comedy-themed browser mini-games for developers.',
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
              Comedy-themed mini-games for developers who should be working.
            </Paragraph>
            <Text fontSize="sm" color={dimText} mb={10}>
              No frameworks were harmed in the making of these games.
              Productivity was, though.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {GAME_METADATA.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={i}
                  onClick={() => setSelectedGame(game.id)}
                />
              ))}
            </SimpleGrid>
          </Box>
        </SlideFade>
      </Container>

      {selected && GameComponent && (
        <GameModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          title={selected.title}
          emoji={selected.emoji}
        >
          <GameComponent />
        </GameModal>
      )}
    </>
  );
}

export default Games;
