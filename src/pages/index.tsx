import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@components/JsonLd';
import ArticleList from '@components/ArticleList';
import { featuredWriting } from '../data/writing';
import { ContactClose, TextLink } from '@components/Editorial';
import { independentWork, professionalWork } from '../data/work';

export default function Index() {
    return (
        <>
            <NextSeo
                title="Adam Hultman | Software Engineer & AI Consultant"
                titleTemplate="%s"
                description="Vancouver software engineer and AI consultant. AI integrations, workflow automation, and custom web applications. Explore my work or discuss a project."
                canonical="https://hultman.dev"
            />
            <JsonLd />
            <section className="hero page-container">
                <header className="hero-identity">
                    <h1>Adam Hultman</h1>
                    <p className="hero-role">
                        Software engineer · Vancouver, BC
                    </p>
                </header>
                <div className="hero-copy">
                    <p className="hero-description">
                        I build web and mobile tools for electrical contractors
                        at <Link href="/work#kopperfield">Kopperfield</Link>. I
                        also run{' '}
                        <Link href="/work#perspective-labs">
                            Perspective Labs Inc.
                        </Link>
                        , where I’m developing independent software products.
                    </p>
                    <div className="hero-actions">
                        <TextLink href="/work" className="button-primary">
                            Selected work
                        </TextLink>
                        <TextLink href="/contact">Get in touch</TextLink>
                        <Link href="/resume" className="quiet-link">
                            Résumé
                        </Link>
                    </div>
                </div>
                <div className="hero-portrait">
                    <Image
                        src="/images/adam-waterfront.webp"
                        alt="Portrait of Adam Hultman"
                        width={900}
                        height={900}
                        priority
                        sizes="(max-width: 767px) 72px, (max-width: 900px) 230px, (max-width: 1100px) 280px, 320px"
                    />
                </div>
            </section>
            <section className="page-container consulting-preview">
                <div className="about-row">
                    <div>
                        <p className="eyebrow">Independent consulting</p>
                        <h2>Software for the work your team needs to do.</h2>
                    </div>
                    <div className="prose">
                        <p>
                            I help teams with AI integrations, internal tools,
                            and custom web applications. Based in Vancouver,
                            with experience in publishing workflows and software
                            for electrical contractors.
                        </p>
                        <div className="inline-actions">
                            <TextLink href="/consulting">
                                AI and software consulting
                            </TextLink>
                        </div>
                    </div>
                </div>
            </section>
            <section id="work" className="professional-preview page-container">
                <p className="eyebrow">Professional work</p>
                <div className="professional-body">
                    <h2>
                        Building at <br />
                        Kopperfield
                    </h2>
                    <div>
                        <p>{professionalWork.summary}</p>
                        <TextLink href="/work#kopperfield">
                            A look at my work
                        </TextLink>
                    </div>
                </div>
                <p className="work-disciplines">
                    Web <span>/</span> Mobile <span>/</span> Backend
                </p>
            </section>
            <section className="perspective-panel">
                <div className="page-container perspective-inner">
                    <p className="eyebrow">Independent work</p>
                    <div className="perspective-heading">
                        <div className="perspective-identity">
                            <h2>
                                Perspective
                                <br />
                                Labs<span> Inc.</span>
                            </h2>
                        </div>
                        <div>
                            <p>{independentWork.summary}</p>
                            <p className="stage-label">
                                Products in development
                            </p>
                            <TextLink href="/work#perspective-labs">
                                Explore the current work
                            </TextLink>
                        </div>
                    </div>
                </div>
            </section>
            <section className="page-container">
                <div className="writing-preview">
                    <div>
                        <p className="eyebrow">Writing</p>
                        <h2>Working notes</h2>
                        <p>
                            Notes on building products, working with AI,
                            <br className="desktop-break" /> and making better
                            engineering decisions.
                        </p>
                    </div>
                    <TextLink href="/blog">All writing</TextLink>
                </div>
                <ArticleList posts={featuredWriting} />
            </section>
            <ContactClose />
        </>
    );
}
