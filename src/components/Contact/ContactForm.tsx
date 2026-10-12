import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
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
    const feedback = useRef<HTMLDivElement>(null);
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();
    const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
    useEffect(() => {
        if (status === 'success') feedback.current?.focus();
    }, [status]);
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
        <div>
            <div ref={feedback} tabIndex={-1} role="status" aria-live="polite">
                {status === 'success' && (
                    <p className="form-feedback">
                        Thanks. Your message has been sent.
                    </p>
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
                    <div className="contact-fields">
                        <ContactFormField
                            id="contact-name"
                            label="Name"
                            error={errors.name?.message}
                        >
                            <input
                                type="text"
                                autoComplete="name"
                                enterKeyHint="next"
                                maxLength={100}
                                id="contact-name"
                                required
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name
                                        ? 'contact-name-error'
                                        : undefined
                                }
                                {...register('name', {
                                    validate: (value) =>
                                        !!value?.trim() || 'Enter your name.',
                                    maxLength: 100,
                                })}
                            />
                        </ContactFormField>
                        <ContactFormField
                            id="contact-email"
                            label="Email"
                            error={errors.email?.message}
                        >
                            <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                enterKeyHint="next"
                                maxLength={254}
                                id="contact-email"
                                required
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? 'contact-email-error'
                                        : undefined
                                }
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
                            id="contact-message"
                            label="Message"
                            error={errors.message?.message}
                        >
                            <textarea
                                rows={6}
                                maxLength={4500}
                                id="contact-message"
                                required
                                aria-invalid={Boolean(errors.message)}
                                aria-describedby={
                                    errors.message
                                        ? 'contact-message-error'
                                        : undefined
                                }
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
                            <p
                                className="form-feedback form-error"
                                role="alert"
                            >
                                Your message wasn’t sent. Your text is still
                                here. Try again or email me directly.
                            </p>
                        )}
                        <button
                            type="submit"
                            className="button-primary contact-submit"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? 'Sending…' : 'Send message'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
