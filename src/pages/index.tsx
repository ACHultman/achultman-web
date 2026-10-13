import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@components/JsonLd';
import ArticleList from '@components/ArticleList';
import { featuredWriting } from '../data/writing';
import { ContactClose, TextLink } from '@components/Editorial';
import { independentWork, professionalWork } from '../data/work';
import { editorialFont } from '../styles/editorialFont';
import ProjectList from '@components/ProjectList';

export default function Index() {
    return (
        <>
            <NextSeo
                title="Adam Hultman | Software Engineer in Vancouver"
                titleTemplate="%s"
                description="Adam Hultman builds web and mobile software at Kopperfield, and independent products in property intelligence, AI video, and audio through Perspective Labs."
                canonical="https://hultman.dev"
            />
            <JsonLd />
            <section
                className={`hero page-container ${editorialFont.variable}`}
            >
                <header className="hero-identity">
                    <h1>Adam Hultman</h1>
                    <p className="hero-role">
                        Software engineer · Vancouver, BC
                    </p>
                </header>
                <div className="hero-copy">
                    <p className="hero-description">
                        I build dependable products and creative tools. At{' '}
                        <Link href="/work#kopperfield">Kopperfield</Link>, I
                        work across web, mobile, and backend systems. Through{' '}
                        <Link href="/work#perspective-labs">
                            Perspective Labs Inc.
                        </Link>
                        , I’m developing property intelligence, AI video, and
                        audio software.
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
                    Web <span aria-hidden="true">/</span> Mobile{' '}
                    <span aria-hidden="true">/</span> Backend
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
                    <ProjectList />
                </div>
            </section>
            <section className="page-container">
                <div className="writing-preview">
                    <div>
                        <p className="eyebrow">Writing</p>
                        <h2>Working notes</h2>
                        <p>
                            Notes on{' '}
                            <Link href="/blog#ai-development">
                                AI-assisted development
                            </Link>
                            ,{' '}
                            <Link href="/blog#react-nextjs">
                                React and Next.js
                            </Link>
                            ,
                            <br className="desktop-break" /> and{' '}
                            <Link href="/blog#performance-and-systems">
                                performance, architecture, and security
                            </Link>
                            .
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
