import { Container } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Home from '@components/Home';
import React from 'react';

function Index() {
    return (
        <>
            <NextSeo
                title="Adam Hultman"
                description="Full-stack software developer (EIT) with 5+ years building AI-enabled, secure, and scalable platforms."
                canonical="https://hultman.dev"
            />
            <Container maxW="container.lg" mt={['5', '10']}>
                <Home />
            </Container>
        </>
    );
}

export default Index;
