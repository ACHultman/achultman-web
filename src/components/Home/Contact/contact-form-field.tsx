import { FormLabel, Input, Textarea, Text } from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface ContactFormFieldProps {
    field: any
    error: FieldError
    placeholder?: string
    isTextArea?: boolean
}

const ContactFormField = ({
    field,
    error,
    placeholder,
    isTextArea,
}: ContactFormFieldProps) => {
    const inputComponent = isTextArea ? (
        <Textarea {...field} id={placeholder} placeholder={placeholder} />
    ) : (
        <Input {...field} id={placeholder} placeholder={placeholder} />
    )

    return (
        <>
            <FormLabel htmlFor={field.name}>{placeholder}</FormLabel>
            {inputComponent}
            <Text color={'red.500'}>{error?.message}</Text>
        </>
    )
}

export default ContactFormField
