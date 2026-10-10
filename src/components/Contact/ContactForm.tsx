import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { captureEvent } from '../../lib/analytics';
import { ContactFormField } from './ContactFormField';

type FormData = {
    name: string;
    email: string;
    message: string;
    website: string;
};

export default function ContactForm() {
    const started = useRef(false);
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();
    const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
    const background = useColorModeValue('paper.50', 'ink.900');
    const border = useColorModeValue('ink.500', 'paper.300');
    const ink = useColorModeValue('ink.900', 'paper.50');
    const fieldStyles = {
        bg: background,
        borderColor: border,
        color: ink,
        borderRadius: '4px',
        fontSize: '1.0625rem',
        minH: '50px',
        _hover: { borderColor: ink },
        _focusVisible: {
            outline: '2px solid',
            outlineColor: ink,
            outlineOffset: '3px',
            boxShadow: 'none',
        },
    };

    async function submit(values: FormData) {
        setStatus('idle');
        try {
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            if (!response.ok || result.success !== true)
                throw new Error('Submission failed');
            setStatus('success');
            captureEvent('contact_form_submitted');
        } catch {
            setStatus('error');
            captureEvent('contact_form_failed');
        }
    }

    return (
        <Box>
            <div role="status" aria-live="polite">
                {status === 'success' && (
                    <Alert status="success" borderRadius="4px">
                        <AlertIcon />
                        Thanks. Your message has been sent.
                    </Alert>
                )}
            </div>
            {status !== 'success' && (
                <form
                    noValidate
                    onSubmit={handleSubmit(submit)}
                    onFocusCapture={() => {
                        if (!started.current) {
                            started.current = true;
                            captureEvent('contact_form_started');
                        }
                    }}
                >
                    <VStack align="stretch" spacing={6}>
                        <ContactFormField
                            label="Name"
                            isRequired
                            error={errors.name?.message}
                        >
                            <Input
                                autoComplete="name"
                                enterKeyHint="next"
                                maxLength={100}
                                {...fieldStyles}
                                {...register('name', {
                                    validate: (value) =>
                                        !!value?.trim() || 'Enter your name.',
                                    maxLength: 100,
                                })}
                            />
                        </ContactFormField>
                        <ContactFormField
                            label="Email"
                            isRequired
                            error={errors.email?.message}
                        >
                            <Input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                enterKeyHint="next"
                                maxLength={254}
                                {...fieldStyles}
                                {...register('email', {
                                    required: 'Enter a valid email address.',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Enter a valid email address.',
                                    },
                                    maxLength: 254,
                                })}
                            />
                        </ContactFormField>
                        <ContactFormField
                            label="Message"
                            isRequired
                            error={errors.message?.message}
                        >
                            <Textarea
                                rows={6}
                                resize="vertical"
                                maxLength={4500}
                                {...fieldStyles}
                                {...register('message', {
                                    validate: (value) =>
                                        !!value?.trim() ||
                                        'Add a short message.',
                                    maxLength: {
                                        value: 4500,
                                        message:
                                            'Keep your message under 4,500 characters.',
                                    },
                                })}
                            />
                        </ContactFormField>
                        <div hidden aria-hidden="true">
                            <label htmlFor="contact-website">
                                Leave this field empty
                            </label>
                            <input
                                id="contact-website"
                                tabIndex={-1}
                                autoComplete="off"
                                {...register('website')}
                            />
                        </div>
                        {status === 'error' && (
                            <Alert
                                status="error"
                                role="alert"
                                alignItems="flex-start"
                                fontSize="15px"
                                borderRadius="4px"
                            >
                                <AlertIcon />
                                Your message wasn’t sent. Your text is still
                                here. Try again or email me directly.
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            loadingText="Sending…"
                            alignSelf="flex-start"
                            width={{ base: '100%', md: 'auto' }}
                            minH="50px"
                            px={7}
                            bg={ink}
                            color={background}
                            fontWeight="500"
                            fontSize="15px"
                            borderRadius="4px"
                            _hover={{ opacity: 0.85 }}
                            _focusVisible={{
                                outline: '2px solid',
                                outlineColor: ink,
                                outlineOffset: '4px',
                            }}
                        >
                            Send message
                        </Button>
                    </VStack>
                </form>
            )}
        </Box>
    );
}
