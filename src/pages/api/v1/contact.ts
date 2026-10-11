import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { getPostHogClient } from '../../../lib/posthog-server';
import { checkRateLimit } from '../../../lib/rate-limit';

type Data = { message: string; success?: boolean };

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };

const contactSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(1).max(4500),
    website: z.string().max(0).optional(),
});

function escapeHtml(text: string) {
    const characters: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(
        /[&<>"']/g,
        (character) => characters[character] || character
    );
}

// Telemetry must never turn a successfully delivered message into a failed submission.
function track(event: string) {
    try {
        getPostHogClient()?.capture({
            distinctId: randomUUID(),
            event,
            properties: { source: 'api' },
        });
    } catch {
        // Contact delivery is independent of analytics availability.
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
    if (
        req.headers['content-type']?.split(';')[0]?.trim().toLowerCase() !==
        'application/json'
    ) {
        return res.status(415).json({ message: 'Expected application/json' });
    }
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: 'Invalid form submission' });
    const emailUser = process.env.NEXT_PUBLIC_EMAIL;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass)
        return res.status(503).json({
            message: 'Contact form unavailable. Please email adam@hultman.dev.',
        });

    const forwardedIp = req.headers['x-real-ip'];
    const ip =
        process.env.VERCEL === '1'
            ? typeof forwardedIp === 'string'
                ? forwardedIp
                : 'unknown'
            : req.socket?.remoteAddress || 'unknown';
    const limit = await checkRateLimit(ip, true);
    for (const [name, value] of Object.entries(limit.headers))
        res.setHeader(name, value);
    if (limit.status !== 200) {
        return res.status(limit.status).json({
            message:
                limit.status === 429
                    ? 'Too many messages. Please try again later.'
                    : 'Contact form temporarily unavailable. Please email directly.',
        });
    }

    const { name, email, message } = parsed.data;
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            disableFileAccess: true,
            disableUrlAccess: true,
            auth: { user: emailUser, pass: emailPass },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
        const delivery = await transporter.sendMail({
            from: { name: 'hultman.dev contact', address: emailUser },
            to: emailUser,
            replyTo: email,
            subject: `Website message from ${name.replace(/[\r\n]+/g, ' ')}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
        });
        if (!delivery.accepted?.length)
            throw new Error('Delivery not accepted');
        track('server_contact_submitted');
        return res
            .status(200)
            .json({ success: true, message: 'Your message has been sent.' });
    } catch {
        // Provider errors can include addresses or message contents; do not log them.
        console.error('Contact email delivery failed');
        track('server_contact_failed');
        return res.status(502).json({
            message:
                'Your message was not sent. Please try again or email directly.',
        });
    }
}
