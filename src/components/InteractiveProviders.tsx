import { useEffect, type PropsWithChildren } from 'react';
import {
    ChakraProvider,
    localStorageManager,
    useColorMode,
} from '@chakra-ui/react';
import { MotionConfig } from 'framer-motion';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import { useSiteColorMode } from '../hooks/useSiteColorMode';
import createEmotionCache from '../utils/createEmotionCache';
import theme from '../theme';

const clientSideEmotionCache = createEmotionCache();

function ColorModeSync() {
    const { colorMode } = useSiteColorMode();
    const { setColorMode } = useColorMode();
    useEffect(() => setColorMode(colorMode), [colorMode, setColorMode]);
    return null;
}

export default function InteractiveProviders({
    children,
    emotionCache = clientSideEmotionCache,
}: PropsWithChildren<{ emotionCache?: EmotionCache }>) {
    return (
        <CacheProvider value={emotionCache}>
            <ChakraProvider
                theme={theme}
                colorModeManager={localStorageManager}
            >
                <ColorModeSync />
                <MotionConfig reducedMotion="user">{children}</MotionConfig>
            </ChakraProvider>
        </CacheProvider>
    );
}
