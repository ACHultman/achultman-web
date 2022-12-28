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
import { motion } from "framer-motion"
import { NavbarIcon } from "./NavbarIcon"

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

const MotionIconButton = motion(IconButton)

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
          <MotionIconButton
            size={"lg"}
            icon={<NavbarIcon isOpen={isOpen} />}
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "flex" }}
            onClick={isOpen ? onClose : onOpen}
            whileTap={{ scale: 0.9 }}
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
