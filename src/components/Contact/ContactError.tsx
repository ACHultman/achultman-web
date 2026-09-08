import { VStack, Flex, Button, useClipboard } from '@chakra-ui/react';
import { ContactAlert } from './ContactAlert';

export function ContactError({
    firstName,
    onRetry,
}: {
    firstName: string;
    onRetry: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    const { hasCopied, onCopy } = useClipboard(
        process.env.NEXT_PUBLIC_EMAIL || 'adam@hultman.dev'
    );

    return (
        <VStack spacing="4">
            <ContactAlert
                status="error"
                title="That didn't go through"
                description={`Sorry, ${firstName}. Try again or copy my email address.`}
            >
                <Flex align="center" justifyContent="space-between" w="100%">
                    <Button onClick={onRetry} colorScheme="blue">
                        Try again
                    </Button>
                    <Button onClick={onCopy} variant="outline">
                        {hasCopied ? 'Email copied' : 'Copy email'}
                    </Button>
                </Flex>
            </ContactAlert>
        </VStack>
    );
}
