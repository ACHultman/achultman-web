import { Box, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function Custom404() {
    const muted = useColorModeValue('ink.600', 'paper.300');

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            minH="64vh"
            maxW="760px"
            px={{ base: 4, md: 8 }}
        >
            <Text className="section-label">404 · wrong turn</Text>
            <Heading as="h1" mt={4} fontSize={{ base: '54px', md: '76px' }}>
                This path ends here.
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color={muted} mt={5} mb={8}>
                The page may have moved, or the link may never have existed.
            </Text>
            <Button
                as={Link}
                href="/"
                leftIcon={<FaArrowLeft size="12px" />}
                bg="ink.900"
                color="paper.50"
                _hover={{ bg: 'moss.700', textDecoration: 'none' }}
            >
                Back to the homepage
            </Button>
        </Box>
    );
}
