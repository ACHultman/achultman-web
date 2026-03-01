import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { serverConfig } from '../../../config';

type Data = {
    message: string;
};

/**
 * Sanitizes user input to prevent XSS attacks by escaping HTML special characters
 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate field lengths
        if (name.length > 100 || email.length > 100 || message.length > 5000) {
            return res.status(400).json({ message: 'Field length exceeded' });
        }

        // Sanitize inputs to prevent XSS
        const sanitizedName = escapeHtml(name.trim());
        const sanitizedEmail = escapeHtml(email.trim());
        const sanitizedMessage = escapeHtml(message.trim());

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL,
                pass: serverConfig.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: '"Contact Form" <no-reply@hultman.dev>',
            to: process.env.NEXT_PUBLIC_EMAIL,
            subject: `New Contact Form Submission from ${sanitizedName}`,
            text: `
                You have a new contact form submission:

                Name: ${sanitizedName}
                Email: ${sanitizedEmail}
                Message: ${sanitizedMessage}
            `,
            html: `
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> ${sanitizedName}</p>
                <p><strong>Email:</strong> ${sanitizedEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Form submission successful' });
    } catch (error) {
        console.error('Error handling contact form submission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
