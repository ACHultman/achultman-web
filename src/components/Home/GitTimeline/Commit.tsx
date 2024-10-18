import { useTheme, Text } from '@chakra-ui/react'
import type { Commit as TCommit } from '@gitgraph/core'
import { ReactSvgElement } from '@gitgraph/react/lib/types'

interface Props {
    commit: TCommit<ReactSvgElement>
}

export function Commit({ commit }: Props) {
    const theme = useTheme()
    return (
        <g transform={`translate(0, ${commit.style.dot.size})`}>
            <text
                fill={commit.style.dot.color}
                alignmentBaseline={'central'}
                fontSize={theme.fontSizes['2xl']}
                fontWeight={theme.fontWeights['semibold']}
            >
                {commit.subject}
            </text>
            <foreignObject
                width={'600'}
                style={{ height: '40px', paddingTop: '16px' }}
            >
                <Text color={commit.style.message.color}>{commit.body}</Text>
            </foreignObject>
        </g>
    )
}
