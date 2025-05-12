import type {
    BranchUserApi,
    GitgraphUserApi,
    Commit as TCommit,
} from '@gitgraph/core';
import { ReactSvgElement } from '@gitgraph/react/lib/types';

export function constructGitGraph(
    gitgraph: GitgraphUserApi<ReactSvgElement>,
    createCommit: (
        branch: BranchUserApi<ReactSvgElement>,
        commit: Partial<TCommit<ReactSvgElement>>
    ) => void
) {
    function createBranchWithCommits(
        parentBranch: BranchUserApi<ReactSvgElement>,
        branchName: string,
        commits: Partial<TCommit<ReactSvgElement>>[]
    ) {
        const branch = parentBranch.branch({ name: branchName });
        commits.forEach((commit) => createCommit(branch, commit));
        parentBranch.merge(branch);
        return branch;
    }

    const main = gitgraph.branch('main');
    createCommit(main, {
        subject: 'Initial commit',
        body: 'September 2017',
    });

    const bsengDegree = createBranchWithCommits(main, 'edu/uvic/bseng', [
        {
            subject: 'Begin Engineering (B.Eng.) degree',
            body: 'September 2017',
        },
        {
            subject: 'Begin Software Engineering (B.S.Eng.) degree',
            body: 'September 2018',
        },
    ]);

    createBranchWithCommits(bsengDegree, 'work/coop/itc', [
        {
            subject: 'Full-stack Software Developer - Co-op',
            body: 'May 2019 - December 2019',
        },
        {
            subject: 'Full-stack Software Developer - Part-time',
            body: 'May 2019 - December 2019',
        },
    ]);

    createBranchWithCommits(bsengDegree, 'work/coop/se', [
        {
            subject: 'Software Designer - Co-op - Term 1',
            body: 'January 2021 - September 2021',
        },
        {
            subject: 'Software Designer - Co-op - Term 2',
            body: 'January 2021 - September 2021',
        },
    ]);

    const assembly = createBranchWithCommits(
        bsengDegree,
        'work/coop/assembly',
        [
            {
                subject: 'Full-stack Software Developer Co-op',
                body: 'September 2021 - December 2021',
            },
        ]
    );

    createBranchWithCommits(assembly, 'work/assembly', [
        {
            subject: 'Software Developer',
            body: 'May 2022 - Present',
        },
    ]);

    createCommit(bsengDegree, {
        subject: 'Complete Software Engineering (B.S.Eng.) degree',
        body: 'August 2022',
    });

    main.merge(bsengDegree);
}
