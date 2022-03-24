import { Box, LightMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaArrowAltCircleUp,
  FaCheck,
  FaEnvelope,
  FaExclamation,
} from "react-icons/fa";
import { MotionButton } from "../Hero";
import ContactForm from "./contact-form";
import { useFormManager } from "./use-form-manager";

const MotionBox = motion(Box);

const Contact = () => {
  const { formState, isOpen, setIsOpen, onSubmit } = useFormManager();

  const contactButtonState =
    formState === "success"
      ? { icon: <FaCheck />, text: "Message sent!" }
      : formState == "error"
      ? {
          icon: <FaExclamation />,
          text: "Error! Please contact me through LinkedIn.",
        }
      : { icon: <FaEnvelope />, text: "Contact" };

  return (
    <>
      <MotionBox
        mt={10}
        p={2}
        borderRadius={5}
        borderTopRightRadius={isOpen ? 100 : 5}
        animate={isOpen ? "open" : "closed"}
      >
        {/* TODO: fix colors, closed state sizing */}
        <LightMode>
          <MotionButton
            onClick={() => setIsOpen(!isOpen)}
            cursor="pointer"
            colorScheme="green"
            bg="green.500"
            borderRadius={5}
            leftIcon={isOpen ? <FaArrowAltCircleUp /> : contactButtonState.icon}
          >
            {isOpen ? "Close" : contactButtonState.text}
          </MotionButton>
          <ContactForm isOpen={isOpen} onSubmit={onSubmit} />
        </LightMode>
      </MotionBox>
    </>
  );
};

export default Contact;
