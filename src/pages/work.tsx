import {
    ContactClose,
    PageIntro,
    PageSeo,
    TextLink,
} from '@components/Editorial';
import {
    independentWork,
    kopperfieldAccomplishments,
    professionalWork,
} from '../data/work';
import ProjectList from '@components/ProjectList';

export default function Work() {
    return (
        <>
            <PageSeo
                title="Selected work"
                path="/work"
                description="Selected engineering work by Adam Hultman: reliability, performance, and mobile at Kopperfield; Before Offer, Parallax Studio, and Earbud at Perspective Labs."
            />
            <div className="page-container">
                <PageIntro label="Work" title="Selected work.">
                    From software used in the field to independent AI products
                    and audio tools. A closer look at what I build and the
                    engineering decisions behind it.
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
                        <p>{professionalWork.description}</p>
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
                    <div className="work-stories">
                        {kopperfieldAccomplishments.map((item) => (
                            <article key={item.title}>
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
                            </article>
                        ))}
                    </div>
                </section>
                <section id="perspective-labs" className="work-section">
                    <div className="work-section-title">
                        <p className="eyebrow">Independent products</p>
                        <h2>
                            Perspective Labs
                            <span className="company-suffix"> Inc.</span>
                        </h2>
                        <p>Products in development</p>
                    </div>
                    <div className="work-section-content">
                        <p>{independentWork.summary}</p>
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
                            This site uses Notion for writing and Next.js for
                            the public pages. The constraint is keeping
                            published articles current without exposing drafts
                            or turning a Notion outage into a missing article.
                        </p>
                        <h3>Publishing and failure handling</h3>
                        <p>
                            The server verifies that each article belongs to the
                            configured collection and is published before
                            reading its content. Pages revalidate hourly; a
                            failed refresh preserves the last successful page.
                            Snapshot content is available only in explicitly
                            configured previews.
                        </p>
                        <h3>Security at the boundaries</h3>
                        <p>
                            Notion blocks render as escaped React elements with
                            checked URLs. The contact endpoint validates and
                            escapes input, sends to a fixed recipient, and stops
                            accepting requests when its shared rate limiter is
                            unavailable. The unused AI chat endpoint was
                            removed.
                        </p>
                        <h3>What the checks establish</h3>
                        <p>
                            Regression tests exercise draft access, upstream
                            failures, hostile content, and contact delivery
                            errors. Browser tests cover keyboard controls,
                            mobile layouts, and automated accessibility rules in
                            both themes. These checks support maintenance; they
                            do not replace a screen-reader review.
                        </p>
                        <TextLink href="https://github.com/ACHultman/achultman-web">
                            Read the source and tests
                        </TextLink>
                        <TextLink href="https://github.com/ACHultman/achultman-web/pull/139">
                            Review the security changes
                        </TextLink>
                    </div>
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
                        <p>
                            Earlier roles included work on data products, cloud
                            applications, and internal tools.
                        </p>
                        <TextLink href="/resume">View résumé</TextLink>
                    </div>
                </section>
            </div>
            <ContactClose />
        </>
    );
}
