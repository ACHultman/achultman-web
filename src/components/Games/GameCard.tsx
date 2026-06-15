import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import type { GameMeta } from '../../data/gamesData';

const MotionBox = motion(Box);

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'red',
};

interface GameCardProps {
  game: GameMeta;
  index: number;
  onClick: () => void;
}

export default function GameCard({ game, index, onClick }: GameCardProps) {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const cardHoverBg = useColorModeValue('white', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      role="group"
      _hover={{ textDecoration: 'none' }}
      display="block"
      h="100%"
      cursor="pointer"
      onClick={onClick}
    >
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={6}
        position="relative"
        overflow="hidden"
        _hover={{
          bg: cardHoverBg,
          transform: 'translateY(-4px)',
          shadow: 'lg',
          borderColor: `${game.colorScheme}.400`,
        }}
        style={{ transition: 'all 0.2s ease' }}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bgGradient={`linear(to-r, ${game.colorScheme}.400, ${game.colorScheme}.200)`}
        />

        <Flex justify="space-between" align="start" mb={3} mt={1}>
          <HStack spacing={2}>
            <Text fontSize="2xl">{game.emoji}</Text>
            <Heading as="h3" size="sm">
              {game.title}
            </Heading>
          </HStack>
          <Badge
            colorScheme={DIFFICULTY_COLORS[game.difficulty]}
            variant="subtle"
            fontSize="xs"
            px={2}
            py={0.5}
            borderRadius="full"
            flexShrink={0}
          >
            {game.difficulty}
          </Badge>
        </Flex>

        <Text fontSize="sm" color={subtleText} mb={4} flex={1}>
          {game.description}
        </Text>

        <Flex
          position="absolute"
          bottom={4}
          right={4}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <Text
            fontSize="xs"
            color={`${game.colorScheme}.400`}
            fontWeight="bold"
          >
            Play →
          </Text>
        </Flex>
      </MotionBox>
    </Box>
  );
}
