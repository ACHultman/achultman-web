import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorMode } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const isDark = colorMode === "dark";

  return (
    <Flex alignItems={"center"}>
      <Button aria-label="Switch Theme" onClick={toggleColorMode}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </Flex>
  );
};
