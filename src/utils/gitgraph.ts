import type {
    BranchUserApi,
    GitgraphUserApi,
    Commit as TCommit,
} from '@gitgraph/core';
import { ReactSvgElement } from '@gitgraph/react/lib/types';
import { BranchDefinition, gitTimelineRootData } from '../data/gitTimelineData';

export function constructGitGraph(
    gitgraph: GitgraphUserApi<ReactSvgElement>,
    createCommit: (
        branch: BranchUserApi<ReactSvgElement>,
        commit: Partial<TCommit<ReactSvgElement>>
    ) => void
) {
    function processBranch(
        parentBranch: BranchUserApi<ReactSvgElement>,
        branchDefinition: BranchDefinition
    ): BranchUserApi<ReactSvgElement> {
        const currentBranch = parentBranch.branch(branchDefinition.name);

        if (branchDefinition.commits) {
            branchDefinition.commits.forEach((commit) =>
                createCommit(currentBranch, commit)
            );
        }

        if (branchDefinition.subBranches) {
            branchDefinition.subBranches.forEach((subBranchDef) => {
                const subBranch = processBranch(currentBranch, subBranchDef);
                if (subBranchDef.merge !== false) {
                    currentBranch.merge(subBranch);
                }
            });
        }

        if (branchDefinition.finalCommits) {
            branchDefinition.finalCommits.forEach((commit) =>
                createCommit(currentBranch, commit)
            );
        }

        return currentBranch;
    }

    const main = gitgraph.branch(gitTimelineRootData.name);
    if (gitTimelineRootData.commits) {
        gitTimelineRootData.commits.forEach((commit) =>
            createCommit(main, commit)
        );
    }

    if (gitTimelineRootData.subBranches) {
        gitTimelineRootData.subBranches.forEach((subBranchDef) => {
            const subBranch = processBranch(main, subBranchDef);
            if (subBranchDef.merge !== false) {
                main.merge(subBranch);
            }
        });
    }
}
