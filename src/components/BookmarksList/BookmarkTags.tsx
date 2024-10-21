import { Button, Collapse, Flex, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpIcon } from '@chakra-ui/icons';

const MotionButton = motion(Button);
const MotionFlex = motion(Flex);

interface Props {
    tags: string[];
    activeTag: string;
    onClick: (tag: string) => void;
}

function BookmarkTags({ tags, activeTag, onClick }: Props) {
    const [showAllTags, setShowAllTags] = useState(false);

    return (
        <VStack gap={4}>
            <AnimatePresence>
                <MotionButton
                    w="100%"
                    variant="outline"
                    onClick={() => setShowAllTags(!showAllTags)}
                >
                    {`Show ${showAllTags ? 'less' : 'more'} tags`}
                </MotionButton>
                <Collapse startingHeight={100} in={showAllTags}>
                    <MotionFlex gap={3} wrap="wrap">
                        {tags.map((tag, i) => {
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
                                    transition={{
                                        duration: 0.1,
                                        delay: i * 0.01,
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                >
                                    {tag}
                                </MotionButton>
                            );
                        })}
                    </MotionFlex>
                </Collapse>
            </AnimatePresence>
        </VStack>
    );
}

export default BookmarkTags;
