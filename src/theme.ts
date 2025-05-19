import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const fonts = { mono: `'Menlo', monospace` };

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
    disableTransitionOnChange: true,
};

const theme = extendTheme({
    config,
    fonts,
});

export default theme;
