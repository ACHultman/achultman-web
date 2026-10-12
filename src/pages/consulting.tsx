import Head from 'next/head';
import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import BreadcrumbJsonLd from '@components/BreadcrumbJsonLd';
import { getBaseUrl } from '../utils/baseUrl';

const baseUrl = getBaseUrl();
const title = 'AI & Software Consulting in Vancouver';
const description =
    'AI integration, workflow automation, and custom software development with Adam Hultman in Vancouver. Work directly with the engineer from scope through release.';

const services = [
    {
        id: 'ai-integration',
        title: 'AI integration',
        intro: 'Put AI to work inside your existing software.',
        detail: 'I build AI-assisted features for drafting, summarizing, and organizing information. That includes the application integrations and review controls needed to make them part of your team’s daily work.',
        scope: 'I test output quality, build in failure handling, and account for response time and model costs before release.',
    },
    {
        id: 'internal-tools',
        title: 'Internal tools and workflow automation',
        intro: 'Cut the manual work between your systems.',
        detail: 'I build internal tools and integrations for operations, reporting, and approvals. That can mean automating document generation, connecting data across existing tools, or replacing a spreadsheet workflow with an application built for the job.',
        scope: 'I work across the interface, API, and database, following the workflow from the source data to the people who need the result.',
    },
    {
        id: 'custom-software',
        title: 'Custom software development',
        intro: 'Launch a web application or move an existing product forward.',
        detail: 'I take on product interfaces, backend features, and integrations, from technical planning through release. I can work within your existing codebase or establish the foundation for a new application.',
        scope: 'My stack includes TypeScript, React, Next.js, Python, and PostgreSQL. Automated tests and maintainable code are part of the delivery, so your team can keep building after release.',
    },
];

export default function Consulting() {
    return (
        <>
            <PageSeo
                title={title}
                description={description}
                path="/consulting"
            />
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Consulting', url: `${baseUrl}/consulting` },
                ]}
            />
            <Head>
                <script
                    key="consulting-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Service',
                            '@id': `${baseUrl}/consulting#service`,
                            name: title,
                            description,
                            url: `${baseUrl}/consulting`,
                            serviceType: services.map(
                                (service) => service.title
                            ),
                            areaServed: { '@type': 'City', name: 'Vancouver' },
                            provider: {
                                '@type': 'Person',
                                '@id': `${baseUrl}/#person`,
                                name: 'Adam Hultman',
                                url: baseUrl,
                            },
                        }).replace(/</g, '\\u003c'),
                    }}
                />
            </Head>
            <div className="page-container consulting-page">
                <PageIntro
                    label="Independent consulting / Vancouver, BC"
                    title="AI and software consulting in Vancouver."
                >
                    I’m Adam Hultman. I help businesses automate manual work,
                    put AI into production, and build custom web applications. I
                    bring experience delivering software for Canadian media
                    teams and the trades, with hands-on engineering from the
                    first technical decisions through release.
                </PageIntro>
                <div className="inline-actions consulting-actions">
                    <TextLink href="/contact" className="button-primary">
                        Discuss a project
                    </TextLink>
                    <TextLink href="/work">See my engineering work</TextLink>
                </div>
                <nav className="section-nav" aria-label="Consulting services">
                    {services.map((service) => (
                        <a key={service.id} href={`#${service.id}`}>
                            {service.id === 'internal-tools'
                                ? 'Workflow automation'
                                : service.title}
                        </a>
                    ))}
                </nav>
                {services.map((service) => (
                    <section
                        key={service.id}
                        id={service.id}
                        className="work-section"
                    >
                        <div className="work-section-title">
                            <h2>{service.title}</h2>
                        </div>
                        <div className="work-section-content">
                            <p className="consulting-lead">{service.intro}</p>
                            <p>{service.detail}</p>
                            <p>{service.scope}</p>
                        </div>
                    </section>
                ))}
                <section className="about-row">
                    <h2>Production experience</h2>
                    <div className="prose">
                        <p>
                            At Assembly Digital, I built an LLM-powered
                            editorial system inside WordPress, used in
                            production by Canadian media teams. Editors could
                            use AI-assisted publishing within their existing
                            workflow.
                        </p>
                        <p>
                            At Island Temperature Controls, I developed a web
                            application for HVAC inventory and maintenance and
                            automated document generation from spreadsheet and
                            database records.
                        </p>
                        <p>
                            At Kopperfield, I work across web, mobile, and
                            backend software for electrical contractors. My
                            contributions include calculator integrations and
                            mobile job and photo workflows.
                        </p>
                        <div className="inline-actions">
                            <TextLink href="/work">Selected work</TextLink>
                            <TextLink href="/blog/ai-assisted-development-at-kopperfield">
                                How I review AI-assisted code
                            </TextLink>
                        </div>
                    </div>
                </section>
                <section className="about-row">
                    <h2>Working together</h2>
                    <div className="principles">
                        <div>
                            <h3>A clear scope before development.</h3>
                            <p>
                                We agree on the outcome, deliverables, budget,
                                and timing. I assess your existing systems and
                                identify the dependencies that could affect the
                                build.
                            </p>
                        </div>
                        <div>
                            <h3>Work directly with me.</h3>
                            <p>
                                I stay involved in both the product decisions
                                and the implementation. You have a direct line
                                to the person who understands the requirements
                                and the code.
                            </p>
                        </div>
                        <div>
                            <h3>Measure the result against the goal.</h3>
                            <p>
                                We evaluate the software against the outcome we
                                set out to achieve, whether that’s less manual
                                entry, faster reviews, or a new product feature.
                                AI integrations also get checks for output
                                quality and failure handling.
                            </p>
                            <div className="inline-actions">
                                <TextLink href="/workflow-automation-roi-calculator">
                                    Estimate workflow automation ROI
                                </TextLink>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="about-row">
                    <h2>Questions about working together</h2>
                    <div className="principles">
                        <div>
                            <h3>Can you work with our existing software?</h3>
                            <p>
                                Yes. I build on existing applications and
                                connect the tools you already use. I’ll review
                                your stack and recommend where an integration,
                                targeted change, or custom application makes
                                sense.
                            </p>
                        </div>
                        <div>
                            <h3>Does the project need AI?</h3>
                            <p>
                                AI is useful for tasks involving language and
                                unstructured information. For predictable,
                                rules-based work, conventional automation can be
                                simpler to run and maintain. I’ll help you
                                choose an approach that fits the task.
                            </p>
                        </div>
                        <div>
                            <h3>How much will it cost?</h3>
                            <p>
                                Pricing depends on the scope, integrations, and
                                support required. Share your project, budget
                                range, and timeline, and we can define an
                                engagement around those constraints.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="about-row">
                    <h2>Let’s discuss your project.</h2>
                    <div className="prose">
                        <p>
                            Tell me what you want to improve or build, the
                            systems involved, and your target timeline. I’ll
                            help define the technical approach and scope.
                        </p>
                        <p>
                            Based in Vancouver, BC. Consulting engagements are
                            independent of my role at Kopperfield.
                        </p>
                        <div className="inline-actions">
                            <TextLink
                                href="/contact"
                                className="button-primary"
                            >
                                Discuss a project
                            </TextLink>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
