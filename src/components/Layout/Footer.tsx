import Link from 'next/link';
import { LogoMark } from '../Logo';
import { useSiteColorMode } from '../../hooks/useSiteColorMode';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function Footer() {
    const { colorMode, toggleColorMode } = useSiteColorMode();
    return (
        <footer className="site-footer page-container">
            <div className="footer-main">
                <div>
                    <Link
                        href="/"
                        prefetch={false}
                        className="wordmark footer-wordmark"
                    >
                        <LogoMark />
                        Adam Hultman<span aria-hidden="true">.</span>
                    </Link>
                    <p>
                        Software and independent products.
                        <br />
                        Vancouver, BC.
                    </p>
                </div>
                <div className="footer-navigation">
                    <nav
                        className="footer-links"
                        aria-label="More on this site"
                    >
                        <Link href="/consulting" prefetch={false}>
                            Consulting
                        </Link>
                        <Link href="/resume" prefetch={false}>
                            Résumé
                        </Link>
                        <Link href="/tools" prefetch={false}>
                            Tools
                        </Link>
                        <Link href="/contact" prefetch={false}>
                            Contact
                        </Link>
                        <Link href="/privacy" prefetch={false}>
                            Privacy
                        </Link>
                    </nav>
                    <nav className="footer-links" aria-label="Profiles">
                        <a
                            href="https://github.com/ACHultman"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub ↗
                        </a>
                        <a
                            href="https://www.linkedin.com/in/adam-hultman/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            LinkedIn ↗
                        </a>
                    </nav>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Adam Hultman</span>
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleColorMode}
                    aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} appearance`}
                >
                    {colorMode === 'dark' ? (
                        <FiSun aria-hidden="true" />
                    ) : (
                        <FiMoon aria-hidden="true" />
                    )}
                    {colorMode === 'dark' ? 'Light' : 'Dark'} appearance
                </button>
            </div>
        </footer>
    );
}
