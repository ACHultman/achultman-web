// Public portfolio copy. Keep customer details, internal tickets, and source
// evidence out of this file. Career figures were supplied by Adam in October 2026.
export const professionalWork = {
    name: 'Kopperfield',
    role: 'Full Stack Engineer · July 2025–present',
    summary:
        'I lead work across offline reliability, electrical calculation correctness, mobile workflows, and billing. Recent results include a faster production API and a regression harness covering 236,000 historical calculations.',
    description:
        'I build web, mobile, and backend software for electrical contractors on a small engineering team. My work runs from investigating customer problems and designing a solution through implementation, release, and follow-up.',
    technologies: [
        'TypeScript',
        'React',
        'Next.js',
        'Python',
        'Django',
        'React Native',
    ],
    href: 'https://www.kopperfield.com',
};

export const workMetrics = [
    {
        value: '1,322 → 160 ms',
        label: 'Production API response, p75',
        detail: 'Load-calculation listing; two-week before/after windows with 10,000+ requests each.',
    },
    {
        value: '236,000',
        label: 'Historical calculations replayed',
        detail: 'Regression coverage for changes to electrical load calculations.',
    },
    {
        value: '~2,300',
        label: 'Paying customers',
        detail: 'Scale of the subscription and entitlement workflows I own.',
    },
];

export const kopperfieldAccomplishments = [
    {
        title: 'Keeping field work on the device',
        body: 'I led the Never Lose Data initiative from a customer report through a design, a 21-ticket implementation plan, and production delivery. Device-local drafts preserve work across interruptions; documents created offline appear in the list and synchronize when connectivity returns.',
        resume: 'Led the Never Lose Data initiative from a customer report through architecture, a 21-ticket plan, and production delivery, adding device-local drafts and automatic synchronization of documents created offline.',
    },
    {
        title: 'Removing repeated work from a busy API',
        body: 'The load-calculation list was recalculating totals and making repeated database queries for each row. I stored the totals for reuse. Production p75 response time fell from 1,322 ms to 160 ms across two-week windows with more than 10,000 requests each. A controlled 20-row benchmark went from 624 database queries to 24; older records without stored totals still use the fallback path.',
        resume: 'Reduced load-calculation API p75 latency from 1,322 ms to 160 ms in production, measured over two-week windows with 10,000+ requests each. A controlled 20-row benchmark reduced database queries from 624 to 24.',
    },
    {
        title: 'Checking the calculations against their sources',
        body: 'I built a regression harness that replays approximately 236,000 historical load calculations to validate changes against existing results. Before the Fault Current Calculator launched, I traced discrepancies against reference software to lookup-table data, rebuilt the affected data from its published source, and tightened the tests.',
        resume: 'Built a regression harness replaying approximately 236,000 historical electrical load calculations. Corrected lookup-table discrepancies against published source data and tightened reference tests before the Fault Current Calculator launched.',
    },
    {
        title: 'Owning billing reliability over time',
        body: 'For approximately 2,300 paying customers, I own plan changes, subscription and seat synchronization, and billing reconciliation. I improved webhook retry handling, moved plan changes into the application, and added daily checks for mismatches between payment and access. This is ongoing reliability work, with further edge cases still being addressed.',
        resume: 'Owned subscription and entitlement workflows serving approximately 2,300 paying customers; improved Stripe webhook retry handling, moved plan changes into the application, and added daily billing reconciliation.',
    },
    {
        title: 'Taking Kopperfield Cam through launch',
        body: 'I led development of the job-site photo experience from design through Android and iOS releases, working with teammates on the capture backend. The work included native photo annotation, job-linked photos and documents, and PDF export. I consolidated roughly 160 launch requirements across design reviews and planning tools. The product is newly launched; adoption is still being measured.',
        resume: 'Led Kopperfield Cam from design through Android and iOS releases, implementing job-site photo workflows, native annotation, and document export while coordinating approximately 160 launch requirements.',
    },
];

export const independentWork = {
    name: 'Perspective Labs Inc.',
    summary:
        'My independent work spans property intelligence, AI video creation, and audio software. I develop the product workflows and the systems behind them, from data pipelines to GPU jobs and C++ signal processing.',
};
