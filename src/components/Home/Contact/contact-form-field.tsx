import { FormLabel, Input, Text } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

interface ContactFormFieldProps {
  field: any;
  error: FieldError;
  placeholder?: string;
}

const ContactFormField = ({
  field,
  error,
  placeholder,
}: ContactFormFieldProps) => {
  return (
    <>
      <FormLabel htmlFor={field.name}>{placeholder}</FormLabel>
      <Input {...field} id={placeholder} placeholder={placeholder} />
      <Text>{error?.message}</Text>
    </>
  );
};

export default ContactFormField;
