type OrgName = 'uvic' | 'itc' | 'se' | 'assembly' | 'kopperfield';

type Org = {
    title: string;
    href: string;
    color: keyof typeof ORG_COLORS;
    description: string;
};

type TimelineItem = {
    org: Org;
    subtitle: string;
    dateRange: string;
};
