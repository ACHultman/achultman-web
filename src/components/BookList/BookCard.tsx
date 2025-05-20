import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';

import Paragraph from '../Paragraph';

import ExternalLink from '@components/ExternalLink';
import { Book } from '../../types/notion';

interface BookCardProps {
    book: Book;
}

function BookCard({ book }: BookCardProps) {
    const noCoverBg = useColorModeValue('gray.100', 'gray.700');

    if (!book) {
        return null;
    }

    const { title, author, link, cover, coverWidth, coverHeight } = book;

    return (
        <ExternalLink href={link} underline={false}>
            <Box
                borderRadius={5}
                borderWidth="1px"
                cursor="pointer"
                role="group"
                _hover={{
                    borderColor: 'green.300',
                }}
                width="100%"
            >
                {cover && coverWidth && coverHeight ? (
                    <Flex
                        position="relative"
                        width="100%"
                        overflow="hidden"
                        borderTopRadius={5}
                        p={2}
                        justifyContent="center"
                    >
                        <Image
                            src={cover}
                            alt={title}
                            width={coverWidth}
                            height={coverHeight}
                            priority
                            style={{
                                objectFit: 'cover',
                                borderRadius: '5px 5px 0 0',
                            }}
                        />
                    </Flex>
                ) : (
                    <Box
                        borderTopRadius={5}
                        bg={noCoverBg}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        color="gray.500"
                        fontSize="lg"
                        p={4}
                    >
                        No Cover Available
                    </Box>
                )}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="space-between"
                    width="100%"
                >
                    <Box p={4}>
                        <Heading as="h6" size="md">
                            {title}
                        </Heading>
                        <Paragraph mt={1} fontSize="sm">
                            {author}
                        </Paragraph>
                    </Box>
                </Box>
            </Box>
        </ExternalLink>
    );
}

export default BookCard;
