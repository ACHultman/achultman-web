import { extendTheme } from "@chakra-ui/react"

const fonts = { mono: `'Menlo', monospace` }

const theme = extendTheme({
  useSystemColorMode: true,
  fonts,
})

export default theme
