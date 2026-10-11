import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { PropsWithChildren } from 'react';
import { NextSeo } from 'next-seo';
import { getBaseUrl } from '../utils/baseUrl';

export function PageSeo({
    title,
    description,
    path,
}: {
    title: string;
    description: string;
    path: string;
}) {
    const baseUrl = getBaseUrl();
    return (
        <NextSeo
            title={title}
            description={description}
            canonical={`${baseUrl}${path}`}
            openGraph={{
                title: `${title} | Adam Hultman`,
                description,
                url: `${baseUrl}${path}`,
                images: [
                    {
                        url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
                        width: 1200,
                        height: 630,
                        alt: `${title} | Adam Hultman`,
                    },
                ],
            }}
        />
    );
}

export function TextLink({
    href,
    children,
    className = '',
}: PropsWithChildren<{ href: string; className?: string }>) {
    const external = href.startsWith('https:') || href.startsWith('mailto:');
    const Icon = external ? FiArrowUpRight : FiArrowRight;
    return (
        <Link
            href={href}
            className={`text-link ${className}`}
            {...(href.startsWith('https:')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
        >
            <span>{children}</span>
            <Icon aria-hidden="true" />
        </Link>
    );
}

export function PageIntro({
    label,
    title,
    children,
}: PropsWithChildren<{ label: string; title: string }>) {
    return (
        <header className="page-intro">
            <p className="eyebrow">{label}</p>
            <h1>{title}</h1>
            {children && <p className="intro-copy">{children}</p>}
        </header>
    );
}

export function ContactClose() {
    return (
        <section id="contact" className="contact-close page-container">
            <div>
                <h2>Something worth discussing?</h2>
                <p>
                    A role, a product idea, or a useful technical conversation.
                    <br className="desktop-break" /> Send a little context.
                </p>
            </div>
            <div className="contact-close-actions">
                <TextLink href="/contact">Get in touch</TextLink>
                <a href="mailto:adam@hultman.dev">adam@hultman.dev</a>
            </div>
        </section>
    );
}
