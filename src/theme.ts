import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: true,
    disableTransitionOnChange: true,
};

const theme = extendTheme({
    config,
    fonts: {
        body: 'var(--font-body), system-ui, sans-serif',
        heading: 'var(--font-body), system-ui, sans-serif',
        mono: "'SFMono-Regular', Consolas, monospace",
    },
    colors: {
        paper: {
            50: '#F5F4EF',
            100: '#EDEEE7',
            200: '#D7DDD6',
            300: '#BBCBC0',
        },
        ink: {
            50: '#f2f3ef',
            100: '#dfe2d9',
            400: '#7c8175',
            500: '#63695e',
            600: '#58635E',
            700: '#363b32',
            800: '#272b24',
            900: '#182522',
            950: '#13211D',
        },
        moss: {
            50: '#f0f3ec',
            100: '#dce4d2',
            200: '#bdcbaa',
            300: '#9daf86',
            400: '#82966d',
            500: '#687b57',
            600: '#2D6658',
            700: '#285C50',
            800: '#313d2d',
            900: '#243021',
        },
        brand: {
            50: '#f0f3ec',
            100: '#dce4d2',
            500: '#687b57',
            600: '#2D6658',
            700: '#285C50',
        },
    },
    styles: {
        global: {
            html: {
                scrollBehavior: 'auto',
            },
            body: {
                bg: 'paper.50',
                color: 'ink.900',
                _dark: {
                    bg: 'ink.950',
                    color: 'paper.50',
                },
            },
            '::selection': {
                bg: 'moss.200',
                color: 'ink.950',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: '6px',
                fontWeight: '700',
                transition:
                    'transform 180ms ease, background 180ms ease, color 180ms ease',
                _focusVisible: {
                    boxShadow: '0 0 0 3px var(--chakra-colors-moss-300)',
                },
            },
        },
        Heading: {
            baseStyle: {
                fontWeight: '400',
                letterSpacing: '-0.025em',
                lineHeight: '1.08',
                textWrap: 'balance',
            },
        },
        Link: {
            baseStyle: {
                textUnderlineOffset: '4px',
                _focusVisible: {
                    boxShadow: '0 0 0 3px var(--chakra-colors-moss-300)',
                    outline: 'none',
                },
            },
        },
    },
});

export default theme;
