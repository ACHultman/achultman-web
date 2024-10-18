export const ORG_COLORS = {
    uvic: '#f5aa1c',
    itc: '#1B538F',
    se: '#3dcd58',
    assembly: '#523eff',
    looking: '#000000',
}

export const ORG_MAP: Record<OrgName, Org> = {
    looking: {
        title: 'Looking for Work',
        href: `mailto:${process.env.NEXT_PUBLIC_EMAIL}`,
        color: 'black',
        description: 'I am currently looking for work.',
    },
    assembly: {
        title: 'Assembly Digital Media',
        href: 'https://assmb.ly',
        color: ORG_COLORS.assembly,
        description:
            'Assembly Digital Media is a tech leader, disrupting the digital publishing industry with an innovative stack of technology that has turned traditional and digital media on its head.',
    },
    se: {
        title: 'Schneider Electric',
        href: 'https://www.se.com',
        color: ORG_COLORS.se,
        description:
            'Schneider Electric is a global leader in the power industry.',
    },
    itc: {
        title: 'Island Temperature Controls',
        href: 'https://islandtemp.com',
        color: ORG_COLORS.itc,
        description:
            'ITC specializes in HVAC and DDC systems for commercial, industrial, marine and institutional properties.',
    },
    uvic: {
        title: 'University of Victoria',
        href: 'https://www.uvic.ca',
        color: ORG_COLORS.uvic,
        description:
            'The University of Victoria is a public research university located in Victoria, British Columbia.',
    },
}
