import {
    ContactClose,
    PageIntro,
    PageSeo,
    TextLink,
} from '@components/Editorial';
import { professionalWork } from '../data/work';

export default function Work() {
    return (
        <>
            <PageSeo
                title="Selected work"
                path="/work"
                description="Professional work at Kopperfield and independent software products in development through Perspective Labs Inc."
            />
            <div className="page-container">
                <PageIntro label="Work" title="Selected work.">
                    My work at Kopperfield, independent products through
                    Perspective Labs, and earlier experience.
                </PageIntro>
                <nav className="section-nav" aria-label="Work sections">
                    <a href="#kopperfield">Kopperfield</a>
                    <a href="#perspective-labs">Perspective Labs</a>
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
                        <p>
                            Recent contributions include the backend and
                            integration for a fault current calculator, mobile
                            job and photo workflows, and practices for reviewing
                            AI-assisted changes.
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
                        <p>
                            Perspective Labs Inc. is my company for developing
                            software products of my own.
                        </p>
                        <p>
                            I’m exploring a small set of ideas. The products are
                            still in development.
                        </p>
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
