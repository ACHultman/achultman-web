import { Container } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Home from '@components/Home';
import JsonLd from '@components/JsonLd';
import React from 'react';

function Index() {
    return (
        <>
            <NextSeo
                title="Adam Hultman — Software Engineer, Vancouver"
                titleTemplate="%s"
                description="Software engineer in Vancouver building AI-powered platforms, developer tools, and secure web applications. 5+ years of full-stack experience."
                canonical="https://hultman.dev"
            />
            <JsonLd />
            <Container maxW="container.lg" mt={{ base: 2, md: 6 }}>
                <Home />
            </Container>
        </>
    );
}

export default Index;
