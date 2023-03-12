import {
    Box,
    Heading,
    LinkOverlay,
    LinkBox,
    useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import Paragraph from '../Paragraph'

import { Book } from './types'

interface BookCardProps {
    book: Book
}

const BookCard = ({ book }: BookCardProps) => {
    if (!book) {
        return null
    }

    const { cover, name, note, link } = book

    // calculate total required width for the book card
    // use the cover image width as a base and add 2 rem
    const totalWidth = `${cover.dimensions.width + 32}px`

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ width: totalWidth }}
        >
            <LinkBox as="article">
                <Box
                    w="100%"
                    p={4}
                    mb={5}
                    display="inline-block"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    borderRadius={5}
                    borderWidth="1px"
                    transition=".5s"
                    cursor="pointer"
                    role="group"
                    _hover={{
                        borderColor: 'green.300',
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="start"
                        justifyContent="space-between"
                    >
                        <Box
                            position="relative"
                            width="100%"
                            height="400px"
                            mb={4}
                        >
                            <Image
                                src={cover.src}
                                layout="fill"
                                objectFit="cover"
                                quality={100}
                                alt={cover.alt}
                                priority={true}
                            />
                        </Box>
                        <LinkOverlay href={link} isExternal>
                            <Heading as="h6" size="md">
                                {name}
                            </Heading>
                            <Paragraph mt={1} fontSize="sm">
                                {note}
                            </Paragraph>
                        </LinkOverlay>
                    </Box>
                </Box>
            </LinkBox>
        </motion.div>
    )
}

export default BookCard
