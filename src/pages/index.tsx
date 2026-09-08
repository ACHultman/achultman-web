import { Container } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Home from '@components/Home';
import JsonLd from '@components/JsonLd';
import React from 'react';

function Index() {
    return (
        <>
            <NextSeo
                title="Custom software development | Adam Hultman"
                titleTemplate="%s"
                description="I build internal tools, AI features and web products. Based in Vancouver. Independent projects from $5,000 USD."
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
