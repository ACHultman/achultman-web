import {
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Textarea,
    VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { MdOutlineEmail } from 'react-icons/md';
import posthog from 'posthog-js';
import { ContactFormField } from './ContactFormField';
import { ContactAlert } from './ContactAlert';
import { ContactError } from './ContactError';

type FormData = {
    name: string;
    email: string;
    intent: string;
    message?: string;
};

const INTENT_OPTIONS = [
    { value: '', label: 'What can I help with? (optional)' },
    { value: 'hiring', label: "Hiring inquiry — I'm looking for a developer" },
    { value: 'freelance', label: 'Freelance project — I have a project in mind' },
    { value: 'collaboration', label: 'Collaboration — open source or side project' },
    { value: 'chat', label: "Just saying hi — let's connect" },
    { value: 'other', label: 'Something else' },
];

function ContactForm() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<FormData>();

    const displayFirstName = getValues('name')?.split(' ')[0] || 'there';

    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'error' | 'success'
    >('idle');

    async function onSubmitForm({ name, email, intent, message }: FormData) {
        let r: Response;
        try {
            r = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message: message || `[Intent: ${intent || 'unspecified'}]` }),
            });
            if (r.ok) {
                setSubmitStatus('success');
                posthog.capture('contact_form_submitted', {
                    intent: intent || 'unspecified',
                });
            } else {
                setSubmitStatus('error');
                posthog.capture('contact_form_failed', {
                    status_code: r.status,
                });
            }
        } catch (err) {
            setSubmitStatus('error');
            posthog.captureException(err);
            posthog.capture('contact_form_failed', { reason: 'network_error' });
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
                            placeholder="First name is fine"
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

                <ContactFormField label="What's this about?">
                    <Select
                        disabled={submitStatus === 'success'}
                        {...register('intent')}
                    >
                        {INTENT_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </Select>
                </ContactFormField>

                <ContactFormField
                    label="Message (optional)"
                    error={errors.message?.message}
                >
                    <Textarea
                        placeholder="What's on your mind? No need to be formal — even a short note works."
                        rows={4}
                        disabled={submitStatus === 'success'}
                        {...register('message')}
                    />
                </ContactFormField>

                {submitStatus === 'success' ? (
                    <ContactAlert
                        status="success"
                        title={`Message sent — thanks, ${displayFirstName}!`}
                        description={
                            <>
                                I typically respond within 24 hours. Looking
                                forward to connecting!
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
                        loadingText="Sending…"
                        type="submit"
                        size="lg"
                        _hover={{ bg: 'green.700' }}
                    >
                        Let&apos;s Connect
                    </Button>
                )}
            </VStack>
        </form>
    );
}

export default ContactForm;
