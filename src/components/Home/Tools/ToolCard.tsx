import {
    Box,
    Flex,
    Icon,
    LinkBox,
    LinkOverlay,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { IconType } from 'react-icons';

interface Props {
    name: string;
    icon: IconType;
    url: string;
}

function ToolCard({ name, icon, url }: Props) {
    const bg = useColorModeValue('gray.100', 'gray.700');
    const hoverBg = useColorModeValue('gray.200', 'gray.600');

    return (
        <LinkBox as="article">
            <Flex
                alignItems="center"
                justifyContent="center"
                flexDir="column"
                p={4}
                bg={bg}
                borderRadius="md"
                textAlign="center"
                _hover={{
                    bg: hoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }}
                style={{ transition: 'all 0.2s ease-in-out' }}
            >
                <Icon as={icon} boxSize={10} mb={2} />
                <LinkOverlay
                    as={NextLink}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Text fontWeight="semibold" fontSize="lg">
                        {name}
                    </Text>
                </LinkOverlay>
            </Flex>
        </LinkBox>
    );
}

export default ToolCard;
