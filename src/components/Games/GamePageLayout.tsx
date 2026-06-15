import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

interface GamePageLayoutProps {
  title: string;
  emoji: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function GamePageLayout({
  title,
  emoji,
  children,
  fullWidth,
}: GamePageLayoutProps) {
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container maxW={fullWidth ? '100%' : 'container.lg'} px={fullWidth ? 0 : 4}>
      <Flex align="center" mb={4} gap={3} px={fullWidth ? 4 : 0} pt={2}>
        <IconButton
          as={NextLink}
          href="/games"
          aria-label="Back to Arcade"
          variant="ghost"
          size="sm"
          fontSize="lg"
          icon={<Text>←</Text>}
        />
        <HStack spacing={2}>
          <Text fontSize="xl">{emoji}</Text>
          <Heading as="h1" size="md">
            {title}
          </Heading>
        </HStack>
      </Flex>
      <Box px={fullWidth ? 0 : 0}>{children}</Box>
    </Container>
  );
}
