import {  Flex, Tag } from '@chakra-ui/react'

type Props = {
    list: string[]
    onClick?: (item: string) => void
    size?: 'sm' | 'md' | 'lg'
    colorScheme?: string
    flexProps?: React.ComponentProps<typeof Flex>
    tagProps?: React.ComponentProps<typeof Tag>
}

export const ChipList = ({ list, onClick, ...opts }: Props) => {
    return (
        <Flex wrap="wrap" gap={2} {...opts.flexProps}>
            {list?.map((item, i) => (
                <Tag
                    key={'tag-' + item + i}
                    size={opts.size || 'md'}
                    colorScheme={opts.colorScheme || 'gray'}
                    marginY={2}
                    marginRight={2}
                    onClick={() => onClick(item)}
                    {...opts.tagProps}
                >
                    {item}
                </Tag>
            ))}
        </Flex>
    )
}
