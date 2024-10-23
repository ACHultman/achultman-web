import NextLink from 'next/link';

import { Link as ChakraLink, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function Link({ children, href, ...props }) {
    const { asPath: currentPath } = useRouter();
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <NextLink href={href} passHref>
            <ChakraLink
                as="div"
                bg={href === currentPath ? bgColor : undefined}
                _hover={{
                    textDecoration: 'none',
                    bg: hoverBgColor,
                }}
                p={2}
                rounded={'md'}
                {...props}
            >
                {children}
            </ChakraLink>
        </NextLink>
    );
}

export default Link;
