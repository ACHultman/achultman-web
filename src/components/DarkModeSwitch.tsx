import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Button, Flex, useColorMode } from '@chakra-ui/react'

export const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    const isDark = colorMode === 'dark'

    return (
        <Flex alignItems="center" cursor="pointer">
            {isDark ? (
                <SunIcon onClick={toggleColorMode} boxSize={8} />
            ) : (
                <MoonIcon onClick={toggleColorMode} boxSize={8} />
            )}
        </Flex>
    )
}
