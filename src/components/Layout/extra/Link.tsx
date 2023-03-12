import NextLink from 'next/link'

import { Link as ChakraLink, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Link = ({ children, href, ...props }) => {
    const { asPath: currentPath } = useRouter()

    return (
        <NextLink href={href} passHref>
            <ChakraLink
                as="div"
                bg={
                    href === currentPath &&
                    useColorModeValue('gray.100', 'gray.700')
                }
                _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                }}
                p={2}
                rounded={'md'}
                {...props}
            >
                {children}
            </ChakraLink>
        </NextLink>
    )
}

export default Link
