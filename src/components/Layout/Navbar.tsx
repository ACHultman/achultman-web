import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"

import { DarkModeSwitch } from "../DarkModeSwitch"
import Logo from "../Logo"
import Link from "./extra/Link"
import DropdownMenu from "./extra/Menu"

const MAIN_LINKS = [
  {
    name: "Home",
    route: "/",
  },
  {
    name: "About Me",
    route: "/about",
  },
]

const EXTRA_LINKS = [
  {
    name: "Bookmarks",
    route: "/bookmarks",
  },
  {
    name: "Books",
    route: "/books",
  },
  {
    name: "Blog",
    route: "/blog",
  },
]

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigationItems = (
    <>
      {MAIN_LINKS.map((link) => (
        <Link href={link.route} key={link.name}>
          {link.name}
        </Link>
      ))}
      <DropdownMenu extraLinks={EXTRA_LINKS} />
    </>
  )

  return (
    <Box py={5} borderTop="2px" borderTopColor="green.500">
      <Container maxW="container.lg">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "inherit" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Logo />
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {!isOpen && navigationItems}
            </HStack>
          </HStack>
          <DarkModeSwitch />
        </Flex>
        {isOpen && (
          <Box pb={4} mt={3}>
            <Stack as={"nav"} spacing={4}>
              {navigationItems}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Navbar
