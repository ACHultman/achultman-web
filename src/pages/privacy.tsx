import { PageIntro, PageSeo } from '@components/Editorial';
import Link from 'next/link';

export default function Privacy() {
    return (
        <>
            <PageSeo
                title="Privacy"
                path="/privacy"
                description="How hultman.dev handles contact messages, analytics, and site preferences."
            />
            <div className="page-container reading-page">
                <PageIntro label="Site information" title="Privacy.">
                    Last updated October 12, 2026.
                </PageIntro>
                <div className="prose">
                    <h2>Contact messages</h2>
                    <p>
                        The contact form sends your name, email address, and
                        message to my email inbox so I can respond. Messages are
                        delivered through Google’s Gmail service. The form does
                        not require a company, budget, or phone number.
                    </p>
                    <p>
                        Messages and replies may remain in my email
                        correspondence. There is no fixed automatic deletion
                        period. Please don’t send confidential information
                        through the form.
                    </p>
                    <h2>Site analytics</h2>
                    <p>
                        The site uses Vercel Analytics and Speed Insights to
                        understand page visits and performance. When configured,
                        PostHog records page views, named interactions, and
                        application errors. PostHog may store a browser
                        identifier and analytics state in cookies or local
                        storage.
                    </p>
                    <p>
                        Contact-form analytics record submission status, without
                        names, email addresses, or message text. Automatic
                        interaction capture and session recordings are disabled.
                    </p>
                    <h2>Hosting and preferences</h2>
                    <p>
                        Vercel hosts the site and processes requests needed to
                        serve its pages. API requests use an IP-based rate
                        limiter backed by Upstash/Redis to reduce abuse.
                        Published writing is loaded from Notion. Your appearance
                        preference is saved in your browser’s local storage.
                    </p>
                    <h2>Your choices</h2>
                    <p>
                        To ask about personal information you have sent, request
                        a correction, or request deletion, use the{' '}
                        <Link href="/contact">contact form</Link>.
                    </p>
                </div>
            </div>
        </>
    );
}
