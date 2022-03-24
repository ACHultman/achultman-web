import axios from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { IFormInput } from "./contact-form";

type FormState = "success" | "error" | "idle";

interface InitialState {
  isOpenInitial?: boolean;
  formStateInitial?: FormState;
}

/**
 * Form Manager Hook used to manage the state of the contact form.
 * - form can be opened and closed with a button
 * - when submit is successful, form shows success message
 * - when submit fails, form shows error message
 * @param props InitialState object with optional initial values for isOpen and formState
 * @returns {{isOpen: boolean, formState: FormState, setIsOpen: (function(*): void), onSubmit: (function(*): void)}}
 */
export const useFormManager = (props?: InitialState) => {
  const [isOpen, setIsOpen] = useState(!!props?.isOpenInitial);
  const [formState, setFormState] = useState<FormState>(
    props?.formStateInitial || "idle"
  );

  const closeFormWithState = (state: FormState) => {
    setIsOpen(false);
    if (state === "success") {
      setFormState("success");
    } else {
      setFormState("error");
    }

    // reset form after 3 seconds
    setTimeout(function () {
      setFormState("idle");
    }, 3000);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const result = await axios.post("/api/contact", data);
      if (result.status === 200) {
        closeFormWithState("success");
      } else {
        // Error receiving message
        closeFormWithState("error");
      }
    } catch (error) {
      // error sending message
      closeFormWithState("error");
    }
  };

  return {
    isOpen,
    setIsOpen,
    formState,
    setFormState,
    onSubmit,
    closeFormWithState,
  };
};
