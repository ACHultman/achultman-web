import Head from 'next/head';
import Link from 'next/link';
import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import BreadcrumbJsonLd from '@components/BreadcrumbJsonLd';
import { getBaseUrl } from '../utils/baseUrl';

const baseUrl = getBaseUrl();
const title = 'AI & Software Consulting in Vancouver';
const description =
    'Work with Adam Hultman, a Vancouver software engineer, on AI integrations, internal tools, workflow automation, and custom web applications.';

const services = [
    {
        id: 'ai-integration',
        title: 'AI integration',
        intro: 'Add AI to a workflow your team already uses.',
        detail: 'Drafting, summarizing, and organizing information can be useful places to start. I can help connect a model to your application, define what it is allowed to do, and build a review step for the people responsible for the result.',
        scope: 'A first version should have a narrow task, examples to test against, and a way to handle failures. We can check output quality, response time, and model costs before expanding it.',
    },
    {
        id: 'internal-tools',
        title: 'Internal tools and workflow automation',
        intro: 'Connect the steps that still depend on copying data by hand.',
        detail: 'That might mean an operations dashboard, an approval queue, a reporting workflow, or an integration between existing systems. I work across the interface, API, and database so the tool fits the people doing the work.',
        scope: 'We start with one recurring task: where information comes from, who checks it, and what happens when something is missing. Sometimes a small integration is enough.',
    },
    {
        id: 'custom-software',
        title: 'Custom software development',
        intro: 'Build a web product, or get an existing one through its next release.',
        detail: 'I can help with product interfaces, backend features, and integrations using TypeScript, React, Next.js, Python, and PostgreSQL. My work includes implementation, automated tests, and the details needed to run and maintain the feature.',
        scope: 'For an existing product, I first look at the code and the release process. For a new idea, we define the smallest useful version and the assumptions it needs to test.',
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
                    I’m Adam Hultman, a software engineer. I help teams build AI
                    integrations, internal tools, and web applications. Bring a
                    specific workflow or product problem, and we can work out
                    what is worth building.
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
                    <h2>Relevant engineering experience</h2>
                    <div className="prose">
                        <p>
                            At Island Temperature Controls, my co-op and
                            contract work included a web application for HVAC
                            inventory and maintenance, and automating document
                            generation from existing spreadsheets and a
                            database.
                        </p>
                        <p>
                            At Assembly Digital, I built an LLM-powered
                            editorial system inside WordPress, used in
                            production by Canadian media teams. It brought
                            AI-assisted publishing into the tools editors were
                            already using.
                        </p>
                        <p>
                            In my role at Kopperfield, I contribute to web,
                            mobile, and backend software for electrical
                            contractors. Recent work includes calculator
                            integrations and mobile job and photo workflows.
                        </p>
                        <p>
                            My experience with Island Temperature Controls,
                            Assembly/Redbrick, and Kopperfield includes contract
                            work before or after co-op and full-time roles.
                            Independent consulting is separate from my current
                            role at Kopperfield.
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
                    <h2>Before we scope a project</h2>
                    <div className="principles">
                        <div>
                            <h3>Describe the work as it happens today.</h3>
                            <p>
                                Tell me who does it, which tools they use, where
                                they lose time, and what a better result would
                                look like. An example is more useful than a long
                                feature list.
                            </p>
                        </div>
                        <div>
                            <h3>Agree on a useful first release.</h3>
                            <p>
                                We can discuss scope, dependencies, budget, and
                                availability before committing to a build.
                                Access to existing systems and the quality of
                                the data often shape the effort.
                            </p>
                        </div>
                        <div>
                            <h3>Decide how to judge the result.</h3>
                            <p>
                                That could be less manual entry, a shorter
                                review queue, or a feature people can use. For
                                AI features, include examples of wrong answers
                                and how the application should respond.
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
                                Yes. An integration or a change to an existing
                                application may be a better fit than a new
                                product. Share your stack and the part that
                                needs attention.
                            </p>
                        </div>
                        <div>
                            <h3>Does the project need AI?</h3>
                            <p>
                                Often it doesn’t. Rules, database queries, or a
                                clearer interface can solve a workflow problem.
                                I use AI where its output can be tested and its
                                limitations handled.
                            </p>
                        </div>
                        <div>
                            <h3>How much will it cost?</h3>
                            <p>
                                Cost depends on the scope, integrations, and
                                ongoing support. Send the problem and any budget
                                or timing constraints so we can discuss a
                                realistic first step.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="about-row">
                    <h2>Tell me what needs building.</h2>
                    <div className="prose">
                        <p>
                            Send a short description of your project, the tools
                            involved, and any deadline. I’m based in Vancouver,
                            BC.
                        </p>
                        <div className="inline-actions">
                            <TextLink
                                href="/contact"
                                className="button-primary"
                            >
                                Discuss a project
                            </TextLink>
                            <Link href="mailto:adam@hultman.dev">
                                adam@hultman.dev
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
