import { Geist, Source_Serif_4 } from 'next/font/google';
import { PropsWithChildren } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const geist = Geist({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
});
const serif = Source_Serif_4({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-editorial',
    weight: ['400'],
    style: ['normal'],
});

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className={`site-shell ${geist.variable} ${serif.variable}`}>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Navbar />
            <main id="main" tabIndex={-1}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
