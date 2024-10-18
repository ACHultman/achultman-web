import {
    Button,
    Flex,
    Heading,
    VStack,
    useBreakpointValue,
} from '@chakra-ui/react'
import { Tag } from './types'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MotionButton = motion(Button)
const MotionFlex = motion(Flex)

interface Props {
    tags: Tag[]
    activeTag: Tag
    onClick: (tag: Tag) => void
}

function BookmarkTags({ tags, activeTag, onClick }: Props) {
    const [showAllTags, setShowAllTags] = useState(false)

    // get device width
    const maxTagCount = useBreakpointValue({
        base: 5,
        md: 8,
    })

    return (
        <VStack gap={4}>
            <Heading as="h2" fontSize="xl">
                Tags
            </Heading>
            <AnimatePresence>
                <MotionFlex gap={3} align="left" wrap="wrap">
                    {tags
                        .slice(0, showAllTags ? tags.length : maxTagCount)
                        .map((tag, i) => {
                            return (
                                <MotionButton
                                    key={tag}
                                    onClick={() => onClick(tag)}
                                    // style
                                    w="fit-content"
                                    borderRadius={20}
                                    textTransform="capitalize"
                                    isActive={activeTag === tag}
                                    _active={{
                                        bg: 'green.500',
                                    }}
                                    // animation
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.1,
                                        delay: i * 0.01,
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                    layout
                                >
                                    {tag}
                                </MotionButton>
                            )
                        })}
                </MotionFlex>
            </AnimatePresence>
            <MotionButton
                w="100%"
                variant="outline"
                onClick={() => setShowAllTags(!showAllTags)}
            >
                {`Show ${showAllTags ? 'less' : 'more'}`}
            </MotionButton>
        </VStack>
    )
}

export default BookmarkTags
