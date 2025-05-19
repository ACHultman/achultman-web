import { Button, Input, InputGroup, InputLeftElement, Textarea, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { MdOutlineEmail } from 'react-icons/md';
import { ContactFormField } from './ContactFormField';
import { ContactAlert } from './ContactAlert';
import { ContactError } from './ContactError';

type FormData = {
    name: string;
    email: string;
    message: string;
};

function ContactForm() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<FormData>();

    const displayFirstName = getValues('name')?.split(' ')[0];

    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'error' | 'success'
    >('idle');

    async function onSubmitForm({ name, email, message }: FormData) {
        let r: Response;
        try {
            r = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            if (r.ok) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <VStack spacing={5}>
                <ContactFormField
                    label="Name"
                    isRequired
                    error={errors.name?.message}
                >
                    <InputGroup>
                        <InputLeftElement>
                            <BsPerson />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Your Name"
                            disabled={submitStatus === 'success'}
                            {...register('name', {
                                required: 'Name is required',
                            })}
                        />
                    </InputGroup>
                </ContactFormField>

                <ContactFormField
                    label="Email"
                    isRequired
                    error={errors.email?.message}
                >
                    <InputGroup>
                        <InputLeftElement>
                            <MdOutlineEmail />
                        </InputLeftElement>
                        <Input
                            type="email"
                            placeholder="Your Email"
                            disabled={submitStatus === 'success'}
                            {...register('email', {
                                required: 'Email is required',
                            })}
                        />
                    </InputGroup>
                </ContactFormField>

                <ContactFormField
                    label="Message"
                    isRequired
                    error={errors.message?.message}
                >
                    <Textarea
                        placeholder="Your Message"
                        rows={6}
                        disabled={submitStatus === 'success'}
                        {...register('message', {
                            required: 'Message is required',
                        })}
                    />
                </ContactFormField>

                {submitStatus === 'success' ? (
                    <ContactAlert
                        status="success"
                        title="Message sent!"
                        description={
                            <>
                                Nice to meet you, {displayFirstName}. I&apos;ll
                                get back to you as soon as I can.
                            </>
                        }
                    />
                ) : submitStatus === 'error' ? (
                    <ContactError
                        firstName={displayFirstName}
                        onRetry={() => setSubmitStatus('idle')}
                    />
                ) : (
                    <Button
                        colorScheme="green"
                        bg="green.600"
                        color="white"
                        width="full"
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Send Message
                    </Button>
                )}
            </VStack>
        </form>
    );
}

export default ContactForm;
