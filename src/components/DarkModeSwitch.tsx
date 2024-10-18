import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Flex, useColorMode } from '@chakra-ui/react'

function DarkModeSwitch() {
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

export default DarkModeSwitch
