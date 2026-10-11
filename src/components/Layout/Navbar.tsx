import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowUpRight, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useColorMode } from '@chakra-ui/react';
import { captureLeadIntent } from '../../lib/analytics';

const links = [
    { name: 'Consulting', href: '/consulting' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Writing', href: '/blog' },
];

export default function Navbar() {
    const { pathname, asPath } = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const [open, setOpen] = useState(false);
    const toggle = useRef<HTMLButtonElement>(null);
    const menu = useRef<HTMLElement>(null);
    const header = useRef<HTMLElement>(null);

    useEffect(() => setOpen(false), [asPath]);
    useEffect(() => {
        if (!open) return;
        menu.current
            ?.querySelector<HTMLAnchorElement>('a')
            ?.focus({ preventScroll: true });
        const escape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                toggle.current?.focus();
            }
        };
        const outside = (event: PointerEvent) => {
            if (!header.current?.contains(event.target as Node)) setOpen(false);
        };
        const desktop = window.matchMedia('(min-width: 901px)');
        const closeOnDesktop = () => {
            if (desktop.matches) setOpen(false);
        };
        document.addEventListener('keydown', escape);
        document.addEventListener('pointerdown', outside);
        desktop.addEventListener('change', closeOnDesktop);
        return () => {
            document.removeEventListener('keydown', escape);
            document.removeEventListener('pointerdown', outside);
            desktop.removeEventListener('change', closeOnDesktop);
        };
    }, [open]);

    const navLinks = (mobile: boolean) => (
        <>
            {links.map(({ name, href }) => (
                <Link
                    key={href}
                    href={href}
                    aria-current={
                        pathname === href || pathname.startsWith(`${href}/`)
                            ? 'page'
                            : undefined
                    }
                    onClick={() => setOpen(false)}
                >
                    {name}
                    {mobile && <FiArrowUpRight aria-hidden="true" />}
                </Link>
            ))}
            <Link
                href="/contact"
                className="nav-contact"
                aria-current={pathname === '/contact' ? 'page' : undefined}
                onClick={() => {
                    captureLeadIntent(
                        mobile ? 'navbar_mobile' : 'navbar_desktop'
                    );
                    setOpen(false);
                }}
            >
                Get in touch <FiArrowUpRight aria-hidden="true" />
            </Link>
        </>
    );

    return (
        <header ref={header} className="site-header">
            <div className="page-container header-inner">
                <Link
                    href="/"
                    className="wordmark"
                    aria-label="Adam Hultman home"
                >
                    Adam Hultman<span aria-hidden="true">.</span>
                </Link>
                <nav className="desktop-nav" aria-label="Main navigation">
                    {navLinks(false)}
                </nav>
                <button
                    ref={toggle}
                    className="menu-toggle"
                    type="button"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    aria-controls="mobile-navigation"
                    onClick={() => setOpen(!open)}
                >
                    {open ? 'Close' : 'Menu'}{' '}
                    {open ? (
                        <FiX aria-hidden="true" />
                    ) : (
                        <FiMenu aria-hidden="true" />
                    )}
                </button>
            </div>
            {open && (
                <nav
                    ref={menu}
                    id="mobile-navigation"
                    className="mobile-nav page-container"
                    aria-label="Main navigation"
                    onBlur={(event) => {
                        if (
                            event.relatedTarget &&
                            !event.currentTarget.contains(
                                event.relatedTarget as Node
                            ) &&
                            event.relatedTarget !== toggle.current
                        )
                            setOpen(false);
                    }}
                >
                    {navLinks(true)}
                    <button
                        type="button"
                        className="theme-toggle nav-appearance"
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
                </nav>
            )}
        </header>
    );
}
