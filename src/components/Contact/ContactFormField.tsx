import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

export interface ContactFormFieldProps {
    label: string;
    isRequired?: boolean;
    children: React.ReactNode;
    error?: string;
}

export function ContactFormField({
    label,
    isRequired,
    children,
    error,
}: ContactFormFieldProps) {
    const requiredColor = useColorModeValue('#a61b13', '#ff8a80');

    return (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
            <FormLabel
                requiredIndicator={
                    <Text as="span" color={requiredColor}>
                        *
                    </Text>
                }
            >
                {label}
            </FormLabel>
            {children}
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
}
