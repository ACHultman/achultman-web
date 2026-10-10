import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import { TIMELINE } from '../constants/timeline';
import { FiDownload } from 'react-icons/fi';

const roles = Object.entries(TIMELINE)
    .sort(([a], [b]) => Number(b) - Number(a))
    .flatMap(([, entries]) => entries)
    .filter((entry) => !entry.subtitle.includes('degree'));

export default function Resume() {
    return (
        <>
            <PageSeo
                title="Résumé"
                path="/resume"
                description="Adam Hultman’s software development experience, education, and technical background."
            />
            <div className="page-container reading-page resume-page">
                <PageIntro label="Résumé" title="Adam Hultman">
                    Software developer · Vancouver, BC
                </PageIntro>
                <div className="resume-toolbar">
                    <a
                        className="button-primary resume-download"
                        href="/adam-hultman-resume.pdf"
                        download
                    >
                        Download PDF <FiDownload aria-hidden="true" />
                    </a>
                    <button
                        className="quiet-link"
                        type="button"
                        onClick={() => window.print()}
                    >
                        Print résumé
                    </button>
                </div>
                <div className="prose">
                    <p>
                        I build software at Kopperfield and develop independent
                        products through Perspective Labs Inc. My work spans
                        web, mobile, backend systems, and applied AI.
                    </p>
                    <p>
                        <a href="mailto:adam@hultman.dev">adam@hultman.dev</a> ·{' '}
                        <a href="https://github.com/ACHultman">GitHub</a> ·{' '}
                        <a href="https://www.linkedin.com/in/adam-hultman/">
                            LinkedIn
                        </a>
                    </p>
                    <h2>Experience</h2>
                    <div className="career-timeline">
                        {roles.map((role) => (
                            <section
                                className="resume-item"
                                key={role.dateRange}
                            >
                                <h3>{role.org.title}</h3>
                                <p className="resume-meta">
                                    <span>{role.subtitle}</span>
                                    <span>{role.dateRange}</span>
                                </p>
                                {role.org.title === 'Kopperfield' && (
                                    <p>
                                        Web, mobile, and backend product
                                        development for electrical contractors.
                                    </p>
                                )}
                                {role.org.title === 'Assembly Digital Media' &&
                                    role.dateRange.startsWith(
                                        'September 2022'
                                    ) && (
                                        <p>
                                            Publishing tools and automation
                                            across WordPress, AWS, and
                                            AI-assisted editorial workflows.
                                        </p>
                                    )}
                            </section>
                        ))}
                    </div>
                    <h2>Independent work</h2>
                    <h3>Perspective Labs Inc.</h3>
                    <p>
                        Developing early-stage independent software products and
                        exploring new business ideas.
                    </p>
                    <h2>Education</h2>
                    <h3>University of Victoria</h3>
                    <p>
                        Bachelor of Software Engineering · August 2022
                        <br />
                        Specialization in cybersecurity and privacy.
                    </p>
                    <h2>Technical work</h2>
                    <p>
                        TypeScript, React, Next.js, Python, Django, React
                        Native, GraphQL, PostgreSQL, AWS, automated testing, and
                        applied AI workflows.
                    </p>
                    <div className="inline-actions">
                        <TextLink href="/work">Selected work</TextLink>
                        <TextLink href="/contact">Get in touch</TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
