import { Container } from '@chakra-ui/react'
import Home from '@components/Home'
import React from 'react'
import { INIT_PROMPT_CHOICES } from 'src/constants/chat'

if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect
}

const Index = () => (
    <Container maxW="container.lg" mt={['5', '10']}>
        <Home />
    </Container>
)

export default Index
