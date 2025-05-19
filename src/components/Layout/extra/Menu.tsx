import { useRouter } from 'next/router';
import { FaAngleDown } from 'react-icons/fa';

import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorModeValue,
} from '@chakra-ui/react';

import Link from './Link';

interface Props {
    extraLinks: { name: string; route: string }[];
    onClick: () => void;
}

function DropdownMenu({ extraLinks, onClick }: Props) {
    const { asPath } = useRouter();
    const menuButtonHoverBg = useColorModeValue('gray.200', 'gray.700');
    const menuListBg = useColorModeValue('gray.50', 'gray.800');
    const activeMenuItemBg = useColorModeValue('gray.200', 'gray.700');

    return (
        <Menu autoSelect={false}>
            <MenuButton
                p={2}
                textAlign="left"
                rounded="md"
                bg="none"
                _hover={{
                    bg: menuButtonHoverBg,
                }}
                _active={{
                    bg: menuButtonHoverBg,
                }}
                fontWeight={400}
                as={Button}
                rightIcon={<FaAngleDown />}
            >
                Extras
            </MenuButton>
            <MenuList bg={menuListBg}>
                {extraLinks.map(({ name, route }) => (
                    <Link href={route} key={name} onClick={onClick} p={2} m={2}>
                        <MenuItem
                            bg={asPath === route ? activeMenuItemBg : undefined}
                        >
                            {name}
                        </MenuItem>
                    </Link>
                ))}
            </MenuList>
        </Menu>
    );
}

export default DropdownMenu;
