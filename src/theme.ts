import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const fonts = {
    mono: `'Menlo', monospace`,
    heading: `'Menlo', monospace`,
};

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
    disableTransitionOnChange: true,
};

const theme = extendTheme({
    config,
    fonts,
    colors: {
        brand: {
            50: '#f0fff4',
            100: '#c6f6d5',
            500: '#38a169',
            600: '#2f855a',
            700: '#276749',
        },
    },
});

export default theme;
