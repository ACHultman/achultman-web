import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from '@chakra-ui/react';

export interface ContactAlertProps {
    status: 'success' | 'error';
    title: string;
    description: React.ReactNode;
    children?: React.ReactNode;
}

export function ContactAlert({
    status,
    title,
    description,
    children,
}: ContactAlertProps) {
    return (
        <Alert
            status={status}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={6}
            borderRadius="lg"
            w="100%"
            gap={4}
        >
            <AlertIcon boxSize="30px" mr={0} />
            <AlertTitle fontSize={{ base: 'md', sm: 'lg' }}>{title}</AlertTitle>
            <AlertDescription
                maxWidth="sm"
                display={{ base: 'none', sm: 'block' }}
            >
                {description}
            </AlertDescription>
            {children}
        </Alert>
    );
}
