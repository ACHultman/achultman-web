import { Container } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Home from '@components/Home';
import JsonLd from '@components/JsonLd';
import React from 'react';

function Index() {
    return (
        <>
            <NextSeo
                title="Adam Hultman | Software Engineer & AI"
                titleTemplate="%s"
                description="Vancouver software engineer building web products and AI features. Experience at Kopperfield and Assembly Digital, plus independent projects."
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
