import Link from 'next/link';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';

export default function Custom404() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="64vh"
            textAlign="center"
            p={4}
        >
            <Heading as="h1" size="2xl" mb={4}>
                404 - Page Not Found
            </Heading>
            <Text fontSize="lg" mb={6}>
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </Text>
            <Link href="/">
                <Button colorScheme="green" leftIcon={<MdHome />}>
                    Go back home
                </Button>
            </Link>
        </Box>
    );
}
