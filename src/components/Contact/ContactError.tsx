import {
    VStack,
    Text,
    Flex,
    Button,
    useClipboard,
    useColorModeValue,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { ContactAlert } from './ContactAlert';

export function ContactError({
    firstName,
    onRetry,
}: {
    firstName: string;
    onRetry: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    const hoverBg = useColorModeValue('blue.500', 'blue.500');
    const hoverColor = useColorModeValue('white', 'gray.700');
    const { hasCopied, onCopy } = useClipboard(
        process.env.NEXT_PUBLIC_EMAIL || ''
    );

    return (
        <VStack spacing="4">
            <ContactAlert
                status="error"
                title="Not sent!"
                description={
                    <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        display="inline-flex"
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        Sorry, {firstName}. Please press&nbsp;
                        <Button
                            variant="link"
                            onClick={onCopy}
                            leftIcon={<MdEmail />}
                            aria-label="Copy email address"
                        >
                            to copy my email address.
                        </Button>
                    </Text>
                }
            >
                <Flex align="center" justifyContent="space-between" w="100%">
                    <Button onClick={onRetry} colorScheme="blue">
                        Try Again
                    </Button>
                    <Button onClick={onCopy} variant="outline">
                        {hasCopied ? 'Copied!' : 'Copy Email'}
                    </Button>
                </Flex>
            </ContactAlert>
        </VStack>
    );
}
