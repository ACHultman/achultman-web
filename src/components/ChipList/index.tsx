import { Flex, Tag } from '@chakra-ui/react';

interface Props {
    list: string[];
    onClick?: (item: string) => void;
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    flexProps?: React.ComponentProps<typeof Flex>;
    tagProps?: React.ComponentProps<typeof Tag>;
}

function ChipList({ list, onClick, ...opts }: Props) {
    return (
        <Flex wrap="wrap" gap={2} {...opts.flexProps}>
            {list?.map((item, i) => (
                <Tag
                    key={'tag-' + item + i}
                    size={opts.size || 'md'}
                    colorScheme={opts.colorScheme || 'gray'}
                    _hover={{ transform: 'scale(1.05)' }}
                    _active={{ transform: 'scale(0.95)' }}
                    cursor="pointer"
                    transition="transform 0.2s"
                    marginY={2}
                    marginRight={2}
                    padding={4}
                    onClick={() => onClick?.(item)}
                    {...opts.tagProps}
                >
                    {item}
                </Tag>
            ))}
        </Flex>
    );
}

export default ChipList;
