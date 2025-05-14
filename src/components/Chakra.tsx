import { ReactNode } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
    ChakraProvider,
    cookieStorageManagerSSR,
    localStorageManager,
} from '@chakra-ui/react';

interface ChakraProps {
    cookies: string;
    children: ReactNode;
}

export function Chakra({ cookies, children }: ChakraProps) {
    const colorModeManager =
        typeof cookies === 'string'
            ? cookieStorageManagerSSR(cookies)
            : localStorageManager;

    return (
        <ChakraProvider colorModeManager={colorModeManager}>
            {children}
        </ChakraProvider>
    );
}

export function getServerSideProps({ req }: GetServerSidePropsContext) {
    return {
        props: {
            cookies: req.headers.cookie ?? '',
        },
    };
}
