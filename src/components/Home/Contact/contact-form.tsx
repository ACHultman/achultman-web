import { Box, BoxProps, Flex, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import ContactFormField from "./contact-form-field";

const variants = {
  open: { opacity: "1", width: "100%", height: "auto" },
  closed: { opacity: "0", width: "0", height: "0" },
};

export interface IFormInput {
  name: string;
  email: string;
  message: string;
}

const schema = yup
  .object({
    name: yup.string().required("Please provide your name"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Please provide your email"),
    message: yup.string().required("Please provide your message"),
  })
  .required();

const MotionBox = motion<BoxProps>(Box);

const ContactForm = ({ isOpen }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  return (
    <>
      <MotionBox animate={isOpen ? "open" : "closed"} variants={variants}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction={"column"} gap={1}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ContactFormField
                  field={field}
                  error={errors.name}
                  placeholder={"Name"}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ContactFormField
                  field={field}
                  error={errors.email}
                  placeholder={"Email"}
                />
              )}
            />

            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ContactFormField
                  field={field}
                  error={errors.message}
                  placeholder={"Message"}
                />
              )}
            />
            <Button mt={4} colorScheme="green" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </MotionBox>
    </>
  );
};

export default ContactForm;
