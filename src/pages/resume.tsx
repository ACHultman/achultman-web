import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import { TIMELINE } from '../constants/timeline';
import { FiDownload } from 'react-icons/fi';
import { kopperfieldAccomplishments } from '../data/work';
import { projects } from '../data/projects';
import Link from 'next/link';

const roles = Object.entries(TIMELINE)
    .sort(([a], [b]) => Number(b) - Number(a))
    .flatMap(([, entries]) => entries)
    .filter((entry) => !entry.subtitle.includes('degree'));
const currentRole = roles.find((role) => role.org.title === 'Kopperfield')!;
const assemblyRole = roles.find(
    (role) => role.org.title === 'Assembly Digital Media'
)!;
const earlierRoles = roles.filter(
    (role) =>
        !['Kopperfield', 'Assembly Digital Media'].includes(role.org.title)
);

export default function Resume() {
    return (
        <>
            <PageSeo
                title="Résumé"
                path="/resume"
                description="Adam Hultman’s engineering experience in product development, applied AI, mobile, performance, and billing, with selected independent projects."
            />
            <div className="page-container reading-page resume-page">
                <PageIntro label="Résumé" title="Adam Hultman">
                    Full-stack software engineer · Vancouver, BC
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
                        <a href="https://hultman.dev/contact">
                            hultman.dev/contact
                        </a>{' '}
                        · <a href="https://github.com/ACHultman">GitHub</a> ·{' '}
                        <a href="https://www.linkedin.com/in/adam-hultman/">
                            LinkedIn
                        </a>
                    </p>
                    <h2>Experience</h2>
                    <section className="resume-item resume-current-role">
                        <h3>{currentRole.org.title}</h3>
                        <p className="resume-meta">
                            <span>{currentRole.subtitle}</span>
                            <span>{currentRole.dateRange}</span>
                        </p>
                        <ul className="resume-bullets">
                            {kopperfieldAccomplishments.map((item) => (
                                <li key={item.title}>{item.resume}</li>
                            ))}
                        </ul>
                    </section>
                    <section className="resume-item">
                        <h3>{assemblyRole.org.title}</h3>
                        <p className="resume-meta">
                            <span>{assemblyRole.subtitle}</span>
                            <span>{assemblyRole.dateRange}</span>
                        </p>
                        <p>
                            Built publishing tools and automation across
                            WordPress, AWS, and AI-assisted editorial workflows.
                        </p>
                        <p className="resume-earlier">
                            Earlier at Assembly: part-time developer, May–August
                            2022; full-stack co-op, September–December 2021.
                        </p>
                    </section>
                    <section className="resume-item">
                        <h3>Earlier experience</h3>
                        {earlierRoles.map((role) => (
                            <p className="resume-earlier" key={role.org.title}>
                                <strong>{role.org.title}</strong> ·{' '}
                                {role.subtitle} ·{' '}
                                {role.dateRange.match(/\d{4}/)?.[0]}
                            </p>
                        ))}
                    </section>
                    <section className="resume-projects">
                        <h2>Independent products</h2>
                        <h3>Perspective Labs Inc.</h3>
                        <p>
                            Independent products in development or at prototype
                            stage.
                        </p>
                        {projects.map((project) => (
                            <section
                                className="resume-project"
                                key={project.slug}
                            >
                                <h3>
                                    <Link
                                        href={`https://hultman.dev/work/${project.slug}`}
                                    >
                                        {project.name}
                                        {project.slug ===
                                            'property-intelligence' &&
                                            ' (working name)'}
                                    </Link>
                                </h3>
                                <p>{project.resume}</p>
                            </section>
                        ))}
                    </section>
                    <h2>Technical skills</h2>
                    <p>
                        TypeScript, React, Next.js, Python, Django, React
                        Native, PostgreSQL, AWS, C++, JUCE, automated testing,
                        AI integrations, asynchronous job processing.
                    </p>
                    <h2>Education</h2>
                    <p>
                        <strong>University of Victoria</strong> · Bachelor of
                        Software Engineering, 2022
                        <br />
                        Specialization in cybersecurity and privacy.
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
