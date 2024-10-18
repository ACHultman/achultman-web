import { extendTheme } from '@chakra-ui/react';

const fonts = { mono: `'Menlo', monospace` };

const theme = extendTheme({
    config: {
        disableTransitionOnChange: false,
    },
    initialColorMode: 'system',
    useSystemColorMode: true,
    fonts,
});

export default theme;
