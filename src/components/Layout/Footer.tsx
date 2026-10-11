import Link from 'next/link';
import { LogoMark } from '../Logo';
import { useColorMode } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function Footer() {
    const { colorMode, toggleColorMode } = useColorMode();
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
                <div className="footer-links" aria-label="More about Adam">
                    <Link href="/consulting">Consulting</Link>
                    <Link href="/resume">Résumé</Link>
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
                    <Link href="/labs">Experiments</Link>
                    <Link href="/privacy">Privacy</Link>
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
