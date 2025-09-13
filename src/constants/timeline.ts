import { ORG_MAP } from 'src/constants';

export const TIMELINE: Record<string, TimelineItem[]> = {
    '2025': [
        {
            org: ORG_MAP.kopperfield,
            subtitle: 'Full Stack Engineer',
            dateRange: 'July 2025 - Present',
        },
    ],
    '2022': [
        {
            org: ORG_MAP.assembly,
            subtitle: 'Software Developer',
            dateRange: 'September 2022 - July 2025',
        },
        {
            org: ORG_MAP.uvic,
            subtitle: 'Completed Software Engineering (B.S.Eng.) degree',
            dateRange: 'August 2022',
        },
        {
            org: ORG_MAP.assembly,
            subtitle: 'Software Developer - Part-time',
            dateRange: 'May 2022 - August 2022',
        },
    ],

    '2021': [
        {
            org: ORG_MAP.assembly,
            subtitle: 'Full-stack Software Developer Co-op',
            dateRange: 'September 2021 - December 2021',
        },
        {
            org: ORG_MAP.se,
            subtitle: 'Software Designer - Co-op',
            dateRange: 'January 2021 - September 2021',
        },
    ],

    '2019': [
        {
            org: ORG_MAP.itc,
            subtitle: 'Full-stack Software Developer - Co-op',
            dateRange: 'May 2019 - December 2019',
        },
    ],

    '2018': [
        {
            org: ORG_MAP.uvic,
            subtitle: 'Began Software Engineering (B.S.Eng.) degree',
            dateRange: 'September 2018',
        },
    ],

    '2017': [
        {
            org: ORG_MAP.uvic,
            subtitle: 'Began Bachelor of Engineering degree',
            dateRange: 'September 2017',
        },
    ],
};
