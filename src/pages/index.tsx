import { Container } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Home from '@components/Home';
import JsonLd from '@components/JsonLd';
import React from 'react';

function Index() {
    return (
        <>
            <NextSeo
                title="AI workflow automation consultant | Adam Hultman"
                titleTemplate="%s"
                description="Custom AI tools for costly B2B workflows. Fixed 30-day pilots from $5,000, built around existing systems and measured against a clear baseline."
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
