import {
    Button,
    Input,
    Textarea,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { captureClientException, captureEvent } from '../../lib/analytics';
import { ContactFormField } from './ContactFormField';
import { ContactAlert } from './ContactAlert';
import { ContactError } from './ContactError';

type FormData = {
    name: string;
    email: string;
    company: string;
    budget: string;
    workflow: string;
};

type Attribution = {
    landingPage: string;
    referrer: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
};

function ContactForm() {
    const hasTrackedStart = useRef(false);
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<FormData>({ defaultValues: { budget: '' } });

    const displayFirstName = getValues('name')?.split(' ')[0] || 'there';
    const fieldBg = useColorModeValue('paper.50', 'ink.900');
    const fieldBorder = useColorModeValue('paper.300', 'ink.600');
    const fieldMuted = useColorModeValue('ink.600', 'paper.300');
    const buttonBg = useColorModeValue('ink.900', 'paper.50');
    const buttonColor = useColorModeValue('paper.50', 'ink.900');
    const fieldStyles = {
        borderColor: fieldBorder,
        bg: fieldBg,
        borderRadius: '6px',
        _placeholder: { color: fieldMuted },
        _hover: { borderColor: 'moss.500' },
        _focusVisible: {
            borderColor: 'moss.600',
            boxShadow: '0 0 0 1px var(--chakra-colors-moss-600)',
        },
    };
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'error' | 'success'
    >('idle');

    function trackFormStart() {
        if (hasTrackedStart.current) return;
        hasTrackedStart.current = true;
        captureEvent('qualified_lead_form_started');
    }

    async function onSubmitForm({
        name,
        email,
        company,
        budget,
        workflow,
    }: FormData) {
        const searchParams = new URLSearchParams(window.location.search);
        const attribution: Attribution = {
            landingPage: window.location.href,
            referrer: document.referrer,
            utmSource: searchParams.get('utm_source') || '',
            utmMedium: searchParams.get('utm_medium') || '',
            utmCampaign: searchParams.get('utm_campaign') || '',
        };

        try {
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    company,
                    budget,
                    workflow,
                    attribution,
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                captureEvent('qualified_lead_submitted', {
                    budget: budget || 'unspecified',
                    has_company: Boolean(company),
                });
                return;
            }

            setSubmitStatus('error');
            captureEvent('contact_form_failed', {
                status_code: response.status,
            });
        } catch (error) {
            setSubmitStatus('error');
            captureClientException(error);
            captureEvent('contact_form_failed', {
                reason: 'network_error',
            });
        }
    }

    if (submitStatus === 'success') {
        return (
            <ContactAlert
                status="success"
                title={`Got it, ${displayFirstName}`}
                description="I'll read through this and get back to you within one business day."
            />
        );
    }

    if (submitStatus === 'error') {
        return (
            <ContactError
                firstName={displayFirstName}
                onRetry={() => setSubmitStatus('idle')}
            />
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitForm)}
            onFocusCapture={trackFormStart}
        >
            <VStack spacing={5} align="stretch">
                <ContactFormField
                    label="Name"
                    isRequired
                    error={errors.name?.message}
                >
                    <Input
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        {...fieldStyles}
                        {...register('name', {
                            required: 'Name is required',
                            maxLength: {
                                value: 100,
                                message:
                                    'Please keep this under 100 characters',
                            },
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
                        autoComplete="email"
                        placeholder="you@company.com"
                        {...fieldStyles}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                    />
                </ContactFormField>

                <ContactFormField
                    label="Company"
                    isRequired
                    error={errors.company?.message}
                >
                    <Input
                        type="text"
                        autoComplete="organization"
                        placeholder="Company or team"
                        {...fieldStyles}
                        {...register('company', {
                            required: 'Company is required',
                            maxLength: {
                                value: 120,
                                message:
                                    'Please keep this under 120 characters',
                            },
                        })}
                    />
                </ContactFormField>

                <ContactFormField
                    label="Your message"
                    isRequired
                    error={errors.workflow?.message}
                >
                    <Textarea
                        placeholder="A role, a project or a question. A few details will help me reply."
                        rows={6}
                        resize="vertical"
                        {...fieldStyles}
                        {...register('workflow', {
                            required: 'Please add a short message',
                            minLength: {
                                value: 20,
                                message:
                                    'A little more detail will help me respond usefully',
                            },
                            maxLength: {
                                value: 4500,
                                message:
                                    'Please keep this under 4,500 characters',
                            },
                        })}
                    />
                </ContactFormField>

                <Button
                    bg={buttonBg}
                    color={buttonColor}
                    width="full"
                    isLoading={isSubmitting}
                    loadingText="Sending"
                    type="submit"
                    size="lg"
                    mt={1}
                    _hover={{ bg: 'moss.700', color: 'paper.50' }}
                    _active={{ transform: 'translateY(0)' }}
                >
                    Send it over
                </Button>
            </VStack>
        </form>
    );
}

export default ContactForm;
