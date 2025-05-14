import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { config } from '../../../config';

type Data = {
    message: string;
};

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

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: config.NEXT_PUBLIC_EMAIL,
                pass: config.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: '"Contact Form" <no-reply@hultman.dev>',
            to: config.NEXT_PUBLIC_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            text: `
                You have a new contact form submission:

                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
            html: `
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Form submission successful' });
    } catch (error) {
        console.error('Error handling contact form submission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
