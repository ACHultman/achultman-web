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
                    <Link href="/" className="wordmark footer-wordmark">
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
                        <Link href="/consulting">Consulting</Link>
                        <Link href="/resume">Résumé</Link>
                        <Link href="/tools" prefetch={false}>
                            Tools
                        </Link>
                        <Link href="/privacy">Privacy</Link>
                    </nav>
                    <nav
                        className="footer-links"
                        aria-label="Profiles and email"
                    >
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
                        <a href="mailto:adam@hultman.dev">Email ↗</a>
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
