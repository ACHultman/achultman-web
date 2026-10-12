import type { ReactNode } from 'react';

export function ContactFormField({
    id,
    label,
    children,
    error,
}: {
    id: string;
    label: string;
    children: ReactNode;
    error?: string;
}) {
    return (
        <div className="contact-field">
            <label htmlFor={id}>
                {label} <span aria-hidden="true">*</span>
            </label>
            {children}
            {error && (
                <p className="form-error" id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
