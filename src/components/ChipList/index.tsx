import { Flex, Tag } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface Props {
    list: string[];
    onClick?: (item: string) => void;
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    flexProps?: React.ComponentProps<typeof Flex>;
    tagProps?: React.ComponentProps<typeof Tag>;
}

const MotionTag = motion(Tag);

function ChipList({ list, onClick, ...opts }: Props) {
    return (
        <Flex wrap="wrap" gap={2} {...opts.flexProps}>
            {list?.map((item, i) => (
                <MotionTag
                    key={'tag-' + item + i}
                    size={opts.size || 'md'}
                    colorScheme={opts.colorScheme || 'gray'}
                    marginY={2}
                    marginRight={2}
                    onClick={() => onClick(item)}
                    initial={{
                        boxShadow: '0px 0px 0px rgba(56, 161, 105, 0.3)',
                    }}
                    animate={{
                        boxShadow: '0px 0px 20px rgba(56, 161, 105, 0.6)',
                        transition: {
                            duration: 5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        },
                    }}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: '0px 0px 20px rgba(56, 161, 105, 0.6)',
                    }}
                    whileTap={{ scale: 0.8 }}
                    {...opts.tagProps}
                >
                    {item}
                </MotionTag>
            ))}
        </Flex>
    );
}

export default ChipList;
