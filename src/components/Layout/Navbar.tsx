import {
    Box,
    DarkMode,
    Flex,
    HStack,
    IconButton,
    Stack,
    useDisclosure,
} from '@chakra-ui/react';

import DarkModeSwitch from '../DarkModeSwitch';
import Logo from '../Logo';
import Link from './extra/Link';
import DropdownMenu from './extra/Menu';
import NavbarIcon from './NavbarIcon';

const MAIN_LINKS = [
    {
        name: 'Home',
        route: '/',
    },
    {
        name: 'About Me',
        route: '/about',
    },
    {
        name: 'Blog',
        route: '/blog',
    },
];

const EXTRA_LINKS = [
    {
        name: 'Bookmarks',
        route: '/bookmarks',
    },
    {
        name: 'Books',
        route: '/books',
    },
];

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigationItems = (
        <>
            {MAIN_LINKS.map((link) => (
                <Link key={link.name} href={link.route} onClick={onClose}>
                    {link.name}
                </Link>
            ))}
            <DropdownMenu extraLinks={EXTRA_LINKS} onClick={onClose} />
        </>
    );

    const blur = isOpen ? 'blur(15px)' : 'blur(5px)';

    return (
        <Box
            as="header"
            zIndex={10}
            top="0px"
            // left 0 if mobile-ish, unset otherwise
            left={['0px', 'unset']}
            width="100%"
            maxW="container.lg"
            py={4}
            px={8}
            position="fixed"
            backdropFilter={blur}
        >
            <Flex alignItems="center" justifyContent="space-between">
                <DarkMode>
                    <IconButton
                        size="lg"
                        bg="transparent !important"
                        icon={<NavbarIcon isOpen={isOpen} />}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        display={{ md: !isOpen ? 'none' : 'flex' }}
                        onClick={isOpen ? onClose : onOpen}
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
    );
}

export default Navbar;
