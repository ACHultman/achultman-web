import { useRouter } from "next/router"
import { FaAngleDown } from "react-icons/fa"

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react"

import Link from "./Link"

const DropdownMenu = ({ extraLinks, onClick }) => {
  const { asPath } = useRouter()

  return (
    <Menu autoSelect={false}>
      <MenuButton
        p={2}
        textAlign="left"
        rounded={"md"}
        bg="none"
        _hover={{
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        _active={{
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        fontWeight={400}
        as={Button}
        rightIcon={<FaAngleDown />}
      >
        Extras
      </MenuButton>
      <MenuList bg={useColorModeValue("gray.50", "gray.800")}>
        {extraLinks.map(({ name, route }) => (
          <Link href={route} key={name} onClick={onClick}>
            <MenuItem
              bg={asPath === route && useColorModeValue("gray.200", "gray.700")}
            >
              {name}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  )
}

export default DropdownMenu
