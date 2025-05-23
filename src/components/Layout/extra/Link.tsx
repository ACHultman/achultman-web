import NextLink from 'next/link';
import { ReactNode } from 'react';
import {
    Link as ChakraLink,
    useColorModeValue,
    LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface LinkProps extends Omit<ChakraLinkProps, 'href'> {
    children: ReactNode;
    href: string;
}

function Link({ children, href, ...props }: LinkProps) {
    const { asPath: currentPath } = useRouter();
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <NextLink href={href} passHref prefetch={false}>
            <ChakraLink
                as="div"
                bg={href === currentPath ? bgColor : undefined}
                _hover={{
                    bg: hoverBgColor,
                }}
                p={2}
                rounded="md"
                {...props}
            >
                {children}
            </ChakraLink>
        </NextLink>
    );
}

export default Link;
