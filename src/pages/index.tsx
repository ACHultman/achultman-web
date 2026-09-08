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
                description="Small software tools for repetitive work between spreadsheets, inboxes and the systems your team already uses. 30-day projects from $5,000."
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
