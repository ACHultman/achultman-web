import { PageIntro, PageSeo } from '@components/Editorial';
import ContactForm from '@components/Contact/ContactForm';
import Link from 'next/link';

export default function Contact() {
    return (
        <>
            <PageSeo
                title="Contact"
                path="/contact"
                description="Get in touch with Adam Hultman about a role, a project, or a useful technical conversation."
            />
            <div className="page-container contact-page">
                <div>
                    <PageIntro label="Contact" title="Let’s talk.">
                        A role, a project, or a useful technical conversation.
                        Send a little context and I’ll take a look.
                    </PageIntro>
                    <p className="contact-location">Based in Vancouver, BC.</p>
                </div>
                <div className="contact-form-wrap">
                    <ContactForm />
                    <p className="form-privacy">
                        Please don’t include confidential information.{' '}
                        <Link href="/privacy">Privacy</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
