import { useEffect, useRef, useState, type FormEvent } from 'react';
import { captureEvent } from '../../lib/analytics';
import { ContactFormField } from './ContactFormField';

type ContactValues = {
    name: string;
    email: string;
    message: string;
    website: string;
};

type FieldErrors = Partial<Record<keyof ContactValues, string>>;

function readValues(form: HTMLFormElement): ContactValues {
    const data = new FormData(form);
    return {
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        message: String(data.get('message') ?? ''),
        website: String(data.get('website') ?? ''),
    };
}

function validate(values: ContactValues): FieldErrors {
    const errors: FieldErrors = {};
    if (!values.name.trim()) errors.name = 'Enter your name.';
    else if (values.name.length > 100)
        errors.name = 'Keep your name under 100 characters.';
    if (
        values.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    )
        errors.email = 'Enter a valid email address.';
    if (!values.message.trim()) errors.message = 'Add a short message.';
    else if (values.message.length > 4500)
        errors.message = 'Keep your message under 4,500 characters.';
    return errors;
}

export default function ContactForm() {
    const started = useRef(false);
    const feedback = useRef<HTMLDivElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const submitting = useRef(false);
    const validated = useRef(false);
    const focusInvalid = useRef(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
    useEffect(() => {
        if (status === 'success') feedback.current?.focus();
    }, [status]);
    useEffect(() => {
        if (focusInvalid.current) {
            form.current
                ?.querySelector<HTMLElement>('[aria-invalid="true"]')
                ?.focus();
            focusInvalid.current = false;
        }
    }, [errors]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting.current) return;
        const values = readValues(event.currentTarget);
        const nextErrors = validate(values);
        validated.current = true;
        focusInvalid.current = Object.keys(nextErrors).length > 0;
        setErrors(nextErrors);
        if (focusInvalid.current) return;
        submitting.current = true;
        setSubmitting(true);
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
        } finally {
            submitting.current = false;
            setSubmitting(false);
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
                    ref={form}
                    noValidate
                    onSubmit={submit}
                    onChange={(event) => {
                        if (validated.current)
                            setErrors(
                                validate(readValues(event.currentTarget))
                            );
                    }}
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
                            error={errors.name}
                        >
                            <input
                                type="text"
                                autoComplete="name"
                                enterKeyHint="next"
                                maxLength={100}
                                id="contact-name"
                                name="name"
                                required
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name
                                        ? 'contact-name-error'
                                        : undefined
                                }
                            />
                        </ContactFormField>
                        <ContactFormField
                            id="contact-email"
                            label="Email"
                            error={errors.email}
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
                                name="email"
                                required
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? 'contact-email-error'
                                        : undefined
                                }
                            />
                        </ContactFormField>
                        <ContactFormField
                            id="contact-message"
                            label="Message"
                            error={errors.message}
                        >
                            <textarea
                                rows={6}
                                maxLength={4500}
                                id="contact-message"
                                name="message"
                                required
                                aria-invalid={Boolean(errors.message)}
                                aria-describedby={
                                    errors.message
                                        ? 'contact-message-error'
                                        : undefined
                                }
                            />
                        </ContactFormField>
                        <div hidden aria-hidden="true">
                            <label htmlFor="contact-website">
                                Leave this field empty
                            </label>
                            <input
                                id="contact-website"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
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
