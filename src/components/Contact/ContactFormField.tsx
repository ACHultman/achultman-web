import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';

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
    return (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
            <FormLabel
                requiredIndicator={<span style={{ color: '#dd3636' }}>*</span>}
            >
                {label}
            </FormLabel>
            {children}
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
}
