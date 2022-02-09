import { Box, LightMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowAltCircleUp, FaEnvelope } from "react-icons/fa";
import { MotionButton } from "../Hero";
import ContactForm from "./contact-form";

const MotionBox = motion(Box);

const variants = {
  open: { width: "100%", height: "100%" },
  closed: { width: "unset", height: "auto" },
};

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MotionBox
        mt={10}
        p={2}
        borderRadius={5}
        borderTopRightRadius={isOpen ? 100 : 5}
        bg="green.500"
        animate={isOpen ? "open" : "closed"}
        variants={variants}
      >
        {/* TODO: fix colors, closed state sizing */}
        <LightMode>
          <MotionButton
            onClick={() => setIsOpen(!isOpen)}
            cursor="pointer"
            colorScheme="green"
            bg="green.500"
            borderRadius={5}
            leftIcon={isOpen ? <FaArrowAltCircleUp /> : <FaEnvelope />}
          >
            {isOpen ? "Close" : "Contact"}
          </MotionButton>
          <ContactForm isOpen={isOpen} />
        </LightMode>
      </MotionBox>
    </>
  );
};

export default Contact;
