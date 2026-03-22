import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  children: ReactNode;
}

export default function GameModal({
  isOpen,
  onClose,
  title,
  emoji,
  children,
}: GameModalProps) {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: '2xl' }}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} mx={{ base: 0, md: 4 }} borderRadius={{ base: 0, md: 'xl' }}>
        <ModalHeader>
          <HStack spacing={2}>
            <Text fontSize="xl">{emoji}</Text>
            <Text>{title}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
