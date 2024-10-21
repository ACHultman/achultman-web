import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';

import Paragraph from '../Paragraph';

import ExternalLink from '@components/ExternalLink';
import { Book } from '../../types/notion';

interface BookCardProps {
    book: Book;
}

function BookCard({ book }: BookCardProps) {
    if (!book) {
        return null;
    }

    const { cover, title, author, link } = book;

    return (
        <ExternalLink href={link} underline={false}>
            <Box
                p={4}
                borderRadius={5}
                borderWidth="1px"
                cursor="pointer"
                role="group"
                _hover={{
                    borderColor: 'green.300',
                }}
                width="100%"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="space-between"
                    width="100%"
                >
                    <Box
                        position="relative"
                        mb={4}
                        width="100%"
                        height="0"
                        paddingTop="150%" // maintain a 2:3 aspect ratio for the image
                        overflow="hidden"
                        borderRadius={5}
                    >
                        {cover ? (
                            <Image
                                src={cover}
                                layout="fill"
                                objectFit="cover"
                                alt={title}
                                priority
                                style={{ borderRadius: '5px' }}
                            />
                        ) : (
                            <Box
                                height="100%"
                                borderRadius={12}
                                bg={useColorModeValue('gray.100', 'gray.900')}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                color="gray.500"
                                fontSize="lg"
                            >
                                No Cover Available
                            </Box>
                        )}
                    </Box>
                    <Heading as="h6" size="md">
                        {title}
                    </Heading>
                    <Paragraph mt={1} fontSize="sm">
                        {author}
                    </Paragraph>
                </Box>
            </Box>
        </ExternalLink>
    );
}

export default BookCard;
