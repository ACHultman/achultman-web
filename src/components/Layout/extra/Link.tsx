import NextLink from "next/link";
import { useRouter } from "next/router";

import { Link as ChakraLink, useColorModeValue } from "@chakra-ui/react";

const Link = ({ children, href, ...props }) => {
  const { asPath } = useRouter();

  return (
    <NextLink href={href} passHref>
      <ChakraLink
        bg={href === asPath && useColorModeValue("gray.100", "gray.700")}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        {...props}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
};

export default Link;
