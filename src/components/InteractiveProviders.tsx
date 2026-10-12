import { useEffect, type PropsWithChildren } from 'react';
import {
    ChakraProvider,
    localStorageManager,
    useColorMode,
} from '@chakra-ui/react';
import { MotionConfig } from 'framer-motion';
import { useSiteColorMode } from '../hooks/useSiteColorMode';
import theme from '../theme';

function ColorModeSync() {
    const { colorMode } = useSiteColorMode();
    const { setColorMode } = useColorMode();
    useEffect(() => setColorMode(colorMode), [colorMode, setColorMode]);
    return null;
}

export default function InteractiveProviders({ children }: PropsWithChildren) {
    return (
        <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
            <ColorModeSync />
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ChakraProvider>
    );
}
