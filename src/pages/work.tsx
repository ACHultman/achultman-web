import {
    ContactClose,
    PageIntro,
    PageSeo,
    TextLink,
} from '@components/Editorial';
import { professionalWork } from '../data/work';
import ProjectList from '@components/ProjectList';
import {
    PerformanceFigure,
    PublishingFlow,
} from '@components/PortfolioVisuals';

export default function Work() {
    return (
        <>
            <PageSeo
                title="Selected work"
                path="/work"
                description="Adam Hultman’s engineering ownership at Kopperfield spans product delivery, operations, infrastructure, reliability, and performance. Explore his work and independent projects."
            />
            <div className="page-container">
                <PageIntro label="Work" title="Selected work.">
                    Software for the working day. Tools for the creative
                    process.
                </PageIntro>
                <nav className="section-nav" aria-label="Work sections">
                    <a href="#kopperfield">Kopperfield</a>
                    <a href="#perspective-labs">Perspective Labs</a>
                    <a href="#this-site">This site</a>
                    <a href="#earlier-work">Earlier work</a>
                </nav>
                <section id="kopperfield" className="work-section">
                    <div className="work-section-title">
                        <p className="eyebrow">Professional work</p>
                        <h2>{professionalWork.name}</h2>
                        <p>{professionalWork.role}</p>
                    </div>
                    <div className="work-section-content">
                        <p>
                            I’m Kopperfield’s sole full-time engineer, building
                            software for electrical contractors and owning
                            engineering operations, infrastructure, and
                            reliability.
                        </p>
                        <p className="technology-line">
                            {professionalWork.technologies.join(' · ')}
                        </p>
                        <TextLink href={professionalWork.href}>
                            Visit Kopperfield
                        </TextLink>
                        <TextLink href="/blog/ai-assisted-development-at-kopperfield">
                            Read about our development process
                        </TextLink>
                    </div>
                    <div className="work-highlights">
                        <PerformanceFigure />
                        <div className="work-outcomes">
                            <article>
                                <h3>From idea to release</h3>
                                <p>
                                    Web features and mobile experiences shipped
                                    on Android and iOS.
                                </p>
                            </article>
                            <article>
                                <h3>Keeping the business running</h3>
                                <p>
                                    Reliable billing, automated operations, and
                                    regression checks before release.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>
                <section id="perspective-labs" className="work-section">
                    <div className="work-section-title">
                        <p className="eyebrow">Independent products</p>
                        <h2>
                            Perspective Labs
                            <span className="company-suffix"> Inc.</span>
                        </h2>
                    </div>
                    <div className="work-section-content">
                        <p>
                            Three independent products in development, from
                            property research to creative tools.
                        </p>
                    </div>
                    <ProjectList />
                </section>
                <section id="this-site" className="work-section">
                    <div className="work-section-title">
                        <p className="eyebrow">Open-source case study</p>
                        <h2>Publishing without a second CMS</h2>
                        <p>
                            hultman.dev · Design, implementation, and
                            maintenance
                        </p>
                    </div>
                    <div className="work-section-content">
                        <p>
                            Write in Notion, publish with Next.js. Drafts stay
                            private, and a failed refresh keeps the last
                            successful page online. Regression and browser tests
                            cover those boundaries, keyboard access, and mobile
                            layouts.
                        </p>
                        <TextLink href="https://github.com/ACHultman/achultman-web">
                            Read the source and tests
                        </TextLink>
                        <TextLink href="https://github.com/ACHultman/achultman-web/pull/139">
                            Review the security changes
                        </TextLink>
                    </div>
                    <PublishingFlow />
                </section>
                <section id="earlier-work" className="work-section">
                    <div className="work-section-title">
                        <p className="eyebrow">Experience</p>
                        <h2>Earlier work</h2>
                    </div>
                    <div className="work-section-content">
                        <p>
                            Previously, at Assembly Digital, I built publishing
                            tools and automation across WordPress, AWS, and
                            AI-assisted editorial workflows.
                        </p>
                        <TextLink href="/resume">View résumé</TextLink>
                    </div>
                </section>
            </div>
            <ContactClose />
        </>
    );
}
