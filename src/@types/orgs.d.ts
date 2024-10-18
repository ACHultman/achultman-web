type OrgName = 'uvic' | 'itc' | 'se' | 'assembly' | 'looking';

type Org = {
    title: string;
    href: string;
    color: string;
    description: string;
};

type TimelineItem = {
    icon: React.FC;
    org: Org;
    subtitle: string;
    dateRange: string;
};
