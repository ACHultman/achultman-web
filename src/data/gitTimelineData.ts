export interface CommitData {
    subject: string;
    body: string;
}

export interface BranchDefinition {
    name: string;
    commits?: CommitData[];
    subBranches?: BranchDefinition[];
    finalCommits?: CommitData[];
}

export const gitTimelineRootData: BranchDefinition = {
    name: 'main',
    commits: [{ subject: 'Initial commit', body: 'September 2017' }],
    subBranches: [
        {
            name: 'edu/uvic/bseng',
            commits: [
                {
                    subject: 'Begin Engineering (B.Eng.) degree',
                    body: 'September 2017',
                },
                {
                    subject: 'Begin Software Engineering (B.S.Eng.) degree',
                    body: 'September 2018',
                },
            ],
            subBranches: [
                {
                    name: 'work/coop/itc',
                    commits: [
                        {
                            subject: 'Full-stack Software Developer - Co-op',
                            body: 'May 2019 - December 2019',
                        },
                        {
                            subject:
                                'Full-stack Software Developer - Part-time',
                            body: 'May 2019 - December 2019',
                        },
                    ],
                },
                {
                    name: 'work/coop/se',
                    commits: [
                        {
                            subject: 'Software Designer - Co-op - Term 1',
                            body: 'January 2021 - September 2021',
                        },
                        {
                            subject: 'Software Designer - Co-op - Term 2',
                            body: 'January 2021 - September 2021',
                        },
                    ],
                },
                {
                    name: 'work/coop/assembly',
                    commits: [
                        {
                            subject: 'Full-stack Software Developer Co-op',
                            body: 'September 2021 - December 2021',
                        },
                    ],
                    subBranches: [
                        {
                            name: 'work/assembly',
                            commits: [
                                {
                                    subject: 'Software Developer',
                                    body: 'May 2022 - Present',
                                },
                            ],
                        },
                    ],
                },
            ],
            finalCommits: [
                {
                    subject: 'Complete Software Engineering (B.S.Eng.) degree',
                    body: 'August 2022',
                },
            ],
        },
    ],
};
