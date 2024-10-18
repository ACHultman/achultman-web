import {
    Box,
    DarkMode,
    Flex,
    HStack,
    IconButton,
    Stack,
    useDisclosure,
} from '@chakra-ui/react'

import DarkModeSwitch from '../DarkModeSwitch'
import Logo from '../Logo'
import Link from './extra/Link'
import DropdownMenu from './extra/Menu'
import { motion } from 'framer-motion'
import NavbarIcon from './NavbarIcon'

const MAIN_LINKS = [
    {
        name: 'Home',
        route: '/',
    },
    {
        name: 'About Me',
        route: '/about',
    },
]

const EXTRA_LINKS = [
    {
        name: 'Bookmarks',
        route: '/bookmarks',
    },
    {
        name: 'Books',
        route: '/books',
    },
    {
        name: 'Blog',
        route: '/blog',
    },
]

const MotionIconButton = motion(IconButton)

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigationItems = (
        <>
            {MAIN_LINKS.map((link) => (
                <Link href={link.route} key={link.name} onClick={onClose}>
                    {link.name}
                </Link>
            ))}
            <DropdownMenu extraLinks={EXTRA_LINKS} onClick={onClose} />
        </>
    )

    const blur = isOpen ? 'blur(15px)' : 'blur(5px)'

    return (
        <Box
            as="header"
            zIndex={10}
            top="0px"
            borderTop="2px solid"
            borderColor="green.500"
            // left 0 if mobile-ish, unset otherwise
            left={['0px', 'unset']}
            width="100%"
            maxW="container.lg"
            py={4}
            px={8}
            position="fixed"
            // blur
            backdropFilter={blur}
        >
            <Flex alignItems="center" justifyContent="space-between">
                <DarkMode>
                    <MotionIconButton
                        size="lg"
                        bg="transparent !important"
                        icon={<NavbarIcon isOpen={isOpen} />}
                        aria-label={'Open Menu'}
                        display={{ md: !isOpen ? 'none' : 'flex' }}
                        onClick={isOpen ? onClose : onOpen}
                        whileTap={{ scale: 0.9 }}
                    />
                </DarkMode>
                <HStack spacing={8} alignItems="center">
                    <Box>
                        <Logo />
                    </Box>
                    <HStack
                        as="nav"
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {!isOpen && navigationItems}
                    </HStack>
                </HStack>
                <DarkModeSwitch />
            </Flex>
            {isOpen && (
                <Box pb={4} mt={3}>
                    <Stack as="nav" spacing={4}>
                        {navigationItems}
                    </Stack>
                </Box>
            )}
        </Box>
    )
}

export default Navbar
