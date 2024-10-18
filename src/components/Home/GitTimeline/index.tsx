import {
    Heading,
    SlideFade,
    ListItem,
    theme,
    Flex,
    Box,
    useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Gitgraph, Mode, TemplateName, templateExtend } from '@gitgraph/react';
import type { BranchUserApi, Commit as TCommit } from '@gitgraph/core';
import { ReactSvgElement } from '@gitgraph/react/lib/types';
import { constructGitGraph } from '../../../utils/gitgraph';
import { ORG_COLORS } from '../../../constants';
import { Commit } from './Commit';

export const MotionHeading = motion(Heading);
export const MotionListItem = motion(ListItem);

const graphTemplate = templateExtend(TemplateName.Metro, {
    colors: [
        theme.colors.green[500],
        ORG_COLORS.uvic,
        ORG_COLORS.itc,
        ORG_COLORS.se,
        ORG_COLORS.assembly,
        ORG_COLORS.assembly,
    ],
    commit: {
        message: {
            displayHash: false,
            displayAuthor: false,
        },
    },
    branch: {
        label: {
            display: false,
        },
    },
});

function renderMessage(commit: TCommit<ReactSvgElement>) {
    return <Commit commit={commit} />;
}

function createCommit(
    branch: BranchUserApi<ReactSvgElement>,
    { subject, body }: Partial<TCommit<ReactSvgElement>>
) {
    branch.commit({
        subject,
        body,
        renderMessage,
    });
}

function GitTimeline() {
    const bgMarginLeftPx = useBreakpointValue({ base: 0, lg: '580px' });

    return (
        <Box
            position="absolute"
            alignSelf="center"
            marginLeft={bgMarginLeftPx}
            zIndex="-1"
            opacity="0.05"
            overflow="hidden"
        >
            <SlideFade in={true} offsetY={80} delay={0.2}>
                <Gitgraph
                    options={{
                        author: 'Adam Hultman <adam@hultman.dev>',
                        template: graphTemplate,
                        mode: Mode.Compact,
                    }}
                >
                    {(gitgraph) => constructGitGraph(gitgraph, createCommit)}
                </Gitgraph>
            </SlideFade>
        </Box>
    );
}

export default GitTimeline;
