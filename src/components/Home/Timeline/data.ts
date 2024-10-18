import { MdCheckCircle } from 'react-icons/md';
import { ORG_MAP } from 'src/constants';

export const TIMELINE: Record<string, TimelineItem[]> = {
    Present: [
        {
            icon: MdCheckCircle,
            org: ORG_MAP.looking,
            subtitle: 'Software Developer',
            dateRange: 'October 2024 - Present',
        },
    ],
    '2022': [
        {
            icon: MdCheckCircle,
            org: ORG_MAP.assembly,
            subtitle: 'Software Developer',
            dateRange: 'September 2022 - October 2024',
        },
        {
            icon: MdCheckCircle,
            org: ORG_MAP.uvic,
            subtitle: 'Completed Software Engineering (B.S.Eng.) degree',
            dateRange: 'August 2022',
        },
        {
            icon: MdCheckCircle,
            org: ORG_MAP.assembly,
            subtitle: 'Software Developer - Part-time',
            dateRange: 'May 2022 - August 2022',
        },
    ],

    '2021': [
        {
            icon: MdCheckCircle,
            org: ORG_MAP.assembly,
            subtitle: 'Full-stack Software Developer Co-op',
            dateRange: 'September 2021 - December 2021',
        },
        {
            icon: MdCheckCircle,
            org: ORG_MAP.se,
            subtitle: 'Software Designer - Co-op',
            dateRange: 'January 2021 - September 2021',
        },
    ],

    '2019': [
        {
            icon: MdCheckCircle,
            org: ORG_MAP.itc,
            subtitle: 'Full-stack Software Developer - Co-op',
            dateRange: 'May 2019 - December 2019',
        },
    ],

    '2018': [
        {
            icon: MdCheckCircle,
            org: ORG_MAP.uvic,
            subtitle: 'Began Software Engineering (B.S.Eng.) degree',
            dateRange: 'September 2018',
        },
    ],

    '2017': [
        {
            icon: MdCheckCircle,
            org: ORG_MAP.uvic,
            subtitle: 'Began Bachelor of Engineering degree',
            dateRange: 'September 2017',
        },
    ],
};
