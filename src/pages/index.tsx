import { Container } from '@chakra-ui/react';
import Home from '@components/Home';
import React from 'react';

function Index() {
    return (
        <Container maxW="container.lg" mt={['5', '10']}>
            <Home />
        </Container>
    );
}

export default Index;
