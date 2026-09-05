import { Container } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Home from '@components/Home';
import JsonLd from '@components/JsonLd';
import React from 'react';

function Index() {
    return (
        <>
            <NextSeo
                title="Adam Hultman | AI product engineer for operations teams"
                titleTemplate="%s"
                description="I build small AI tools for costly manual workflows. Fixed 30-day pilots for B2B operations teams."
                canonical="https://hultman.dev"
            />
            <JsonLd />
            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <Home />
            </Container>
        </>
    );
}

export default Index;
