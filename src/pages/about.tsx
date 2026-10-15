import { PageSeo, TextLink } from '@components/Editorial';
import { editorialFont } from '../styles/editorialFont';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import GitHubActivity from '../components/GitHubActivity';
import { fetchGitHubActivity } from '../services/github-activity';
import type { GitHubActivity as Activity } from '../types/github-activity';

const principles = [
    [
        'Understand the task before designing the feature.',
        'The awkward cases usually matter more than the ideal flow.',
    ],
    [
        'Make the important decisions visible.',
        'Clear interfaces and understandable implementation make a product easier to review and change.',
    ],
    [
        'Stay involved after release.',
        'Testing, feedback, and follow-up work are part of the job.',
    ],
];

export default function About({ activity }: { activity: Activity | null }) {
    return (
        <>
            <PageSeo
                title="About"
                path="/about"
                description="Adam Hultman is a Vancouver software engineer responsible for engineering operations and product delivery at Kopperfield, with independent work in AI and audio."
            />
            <div
                className={`page-container about-page ${editorialFont.variable}`}
            >
                <header className="page-intro">
                    <p className="eyebrow">About</p>
                    <h1 className="editorial-title">A bit about me.</h1>
                </header>
                <section className="about-row" aria-label="Background">
                    <p className="eyebrow">A little context</p>
                    <div className="prose">
                        <p className="lead">
                            I’m Adam Hultman, a software engineer based in
                            Vancouver.
                        </p>
                        <p>
                            I take product problems from investigation through
                            design, implementation, and release. I’m drawn to
                            work where the interface and the underlying system
                            both need careful thought.
                        </p>
                        <p>
                            I’m Kopperfield’s sole full-time engineer,
                            responsible for the day-to-day health of
                            engineering. That includes engineering operations,
                            infrastructure, application reliability, and
                            performance. I also build and ship web and mobile
                            products, automate operational workflows, and own
                            subscription and billing systems.
                        </p>
                        <p>
                            I bring engineering updates and priorities into
                            company meetings, connecting the technical work to
                            what the business needs.
                        </p>
                        <p>
                            Through Perspective Labs Inc., I’m developing{' '}
                            <Link href="/work/property-intelligence">
                                Tenurel
                            </Link>
                            , a property intelligence product;{' '}
                            <Link href="/work/parallax-studio">
                                Parallax Studio
                            </Link>
                            , an AI video application; and{' '}
                            <Link href="/work/earbud">Earbud</Link>, a C++ audio
                            plugin. They give me room to work on data analysis,
                            creative workflows, and signal processing.
                        </p>
                        <p>
                            Previously, I built publishing tools and automation
                            at Assembly Digital. I studied Software Engineering
                            at the University of Victoria, specializing in
                            cybersecurity and privacy.
                        </p>
                    </div>
                </section>
                <GitHubActivity activity={activity} />
                <section className="about-row" id="fit">
                    <h2>
                        How I approach
                        <br className="desktop-break" /> the work
                    </h2>
                    <div className="principles">
                        {principles.map(([title, detail]) => (
                            <div key={title}>
                                <h3>{title}</h3>
                                <p>{detail}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="about-row">
                    <h2>Tools I use</h2>
                    <dl className="working-stack">
                        <div>
                            <dt>Web</dt>
                            <dd>TypeScript, React, Next.js</dd>
                        </div>
                        <div>
                            <dt>Backend</dt>
                            <dd>Python, Django, GraphQL, PostgreSQL</dd>
                        </div>
                        <div>
                            <dt>Mobile</dt>
                            <dd>React Native</dd>
                        </div>
                        <div>
                            <dt>Audio</dt>
                            <dd>C++, JUCE, digital signal processing</dd>
                        </div>
                        <div>
                            <dt>Also</dt>
                            <dd>
                                AWS, automated testing, applied AI workflows
                            </dd>
                        </div>
                    </dl>
                </section>
                <section className="about-row">
                    <h2>Reading</h2>
                    <div className="prose">
                        <p>
                            Books I recommend and useful links I’ve saved on
                            software, design, and building products.
                        </p>
                        <div className="inline-actions">
                            <TextLink href="/books">Books</TextLink>
                            <TextLink href="/bookmarks">Bookmarks</TextLink>
                        </div>
                    </div>
                </section>
                <section className="about-row">
                    <p className="eyebrow">Away from the keyboard</p>
                    <div className="prose">
                        <p>
                            Outside work, I run, travel, go to stand-up shows,
                            and lose time to astrophysics rabbit holes.
                        </p>
                        <div className="inline-actions">
                            <TextLink href="/resume">View résumé</TextLink>
                            <TextLink href="/contact">Get in touch</TextLink>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export const getStaticProps: GetStaticProps<{
    activity: Activity | null;
}> = async ({ revalidateReason }) => {
    try {
        return {
            props: { activity: await fetchGitHubActivity() },
            revalidate: 21_600,
        };
    } catch (error) {
        // Failed regeneration keeps the last successful page and its real dates.
        // A first build can still publish About, then retry after five minutes.
        if (revalidateReason !== 'build') throw error;
        console.warn(
            'GitHub activity unavailable during the About page build.'
        );
        return { props: { activity: null }, revalidate: 300 };
    }
};
