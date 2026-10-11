import { PageIntro, PageSeo, TextLink } from '@components/Editorial';

const experiments = [
    {
        title: 'Sorting Algorithm Arena',
        href: '/labs/sort-arena',
        description:
            'Compare sorting algorithms with animated arrays and step-by-step playback.',
        category: 'Algorithms',
    },
    {
        title: 'Regex Debugger',
        href: '/labs/regex-debugger',
        description:
            'Explore regular-expression matches with example patterns and highlighted text.',
        category: 'Developer tools',
    },
    {
        title: 'Compression Visualizer',
        href: '/labs/compression',
        description:
            'Follow Huffman coding and run-length encoding through small text examples.',
        category: 'Algorithms',
    },
    {
        title: 'AST Explorer',
        href: '/labs/ast-explorer',
        description:
            'Explore tokens and syntax trees using a simplified JavaScript parser.',
        category: 'Languages',
    },
    {
        title: 'Shader Playground',
        href: '/labs/shader-playground',
        description:
            'Edit fragment shaders and explore procedural graphics in the browser.',
        category: 'Graphics',
    },
    {
        title: 'BeatMaker',
        href: '/labs/beatmaker',
        description:
            'Try a browser-based step sequencer with synthesized sounds and preset patterns.',
        category: 'Audio',
    },
];

export default function Labs() {
    return (
        <>
            <PageSeo
                title="Experiments"
                path="/labs"
                description="A selected archive of browser experiments in algorithms, developer tools, graphics, and sound."
            />
            <div className="page-container">
                <PageIntro label="Labs / Selected archive" title="Experiments.">
                    Small browser experiments in algorithms, developer tools,
                    graphics, and sound. These use simplified models to make an
                    idea easier to explore.
                </PageIntro>
                <div className="experiment-list">
                    {experiments.map((experiment) => (
                        <article key={experiment.href}>
                            <p className="eyebrow">{experiment.category}</p>
                            <h2>
                                <TextLink href={experiment.href}>
                                    {experiment.title}
                                </TextLink>
                            </h2>
                            <p>{experiment.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}
