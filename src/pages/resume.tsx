import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import { TIMELINE } from '../constants/timeline';
import { FiDownload } from 'react-icons/fi';
import { kopperfieldResumeHighlights } from '../data/work';
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

export default function Resume() {
    return (
        <>
            <PageSeo
                title="Résumé"
                path="/resume"
                description="Adam Hultman’s experience as Kopperfield’s sole full-time engineer, with ownership of product delivery, engineering operations, infrastructure, and performance."
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
                    <p className="resume-contact">
                        <a href="https://hultman.dev/contact">
                            hultman.dev/contact
                        </a>{' '}
                        ·{' '}
                        <a href="https://github.com/ACHultman">
                            github.com/ACHultman
                        </a>{' '}
                        ·{' '}
                        <a href="https://www.linkedin.com/in/adam-hultman/">
                            linkedin.com/in/adam-hultman
                        </a>
                    </p>
                    <h2>Experience</h2>
                    <section className="resume-item resume-current-role">
                        <h3>{currentRole.org.title}</h3>
                        <p className="resume-meta">
                            <span>{currentRole.subtitle}</span>
                            <span>{currentRole.dateRange}</span>
                        </p>
                        <p className="resume-context">
                            Sole full-time engineer, owning engineering
                            operations, infrastructure, reliability, and
                            performance. Report engineering progress and
                            priorities in company meetings.
                        </p>
                        <ul className="resume-bullets">
                            {kopperfieldResumeHighlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                            ))}
                        </ul>
                    </section>
                    <section className="resume-item">
                        <h3>{assemblyRole.org.title}</h3>
                        <p className="resume-meta">
                            <span>{assemblyRole.subtitle}</span>
                            <span>{assemblyRole.dateRange}</span>
                        </p>
                        <ul className="resume-bullets">
                            <li>
                                Built a distributed link validation and repair
                                system on AWS Lambda, SQS, and DynamoDB that
                                processed 50K+ links.
                            </li>
                            <li>
                                Led development of an LLM-powered WordPress
                                editorial system used by Canadian media teams;
                                mentored co-op developers in TypeScript, React,
                                and backend design.
                            </li>
                            <li>
                                Automated product-recall ingestion and
                                publishing to WordPress with AWS CDK and
                                EventBridge.
                            </li>
                            <li>
                                Built URL redirect tools for content managers
                                and engineers across WordPress, a Go API, and
                                Express.
                            </li>
                        </ul>
                    </section>
                    <section className="resume-projects">
                        <h2>Projects</h2>
                        <p className="resume-projects-context">
                            Perspective Labs Inc. · Independent products in
                            development
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
                                    </Link>
                                    <span className="resume-project-discipline">
                                        {' '}
                                        · {project.discipline}
                                    </span>
                                </h3>
                                <p>{project.resume}</p>
                            </section>
                        ))}
                    </section>
                    <h2>Technical skills</h2>
                    <p className="resume-skills">
                        <strong>Languages:</strong> TypeScript, Python, Go, C++.{' '}
                        <strong>Web &amp; mobile:</strong> React, Next.js,
                        Django, React Native.
                        <br />
                        <strong>Data &amp; systems:</strong> PostgreSQL, AWS,
                        OpenAI API, asynchronous jobs, automated testing, JUCE.
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
