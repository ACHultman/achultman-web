import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { createHash } from 'crypto';
import { z } from 'zod';
import { serverConfig } from '../../../config';
import { getPostHogClient } from '../../../lib/posthog-server';

type Data = {
    message: string;
};

// Cap the request body so oversized payloads are rejected before the
// field-level length checks ever parse them into memory.
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '16kb',
        },
    },
};

const BUDGET_VALUES = ['5k-10k', '10k-25k', '25k+', 'unsure', ''] as const;

const attributionSchema = z.object({
    landingPage: z.string().max(2000).default(''),
    referrer: z.string().max(2000).default(''),
    utmSource: z.string().max(200).default(''),
    utmMedium: z.string().max(200).default(''),
    utmCampaign: z.string().max(200).default(''),
});

const contactSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    company: z.string().trim().min(1).max(120),
    budget: z.enum(BUDGET_VALUES).default(''),
    workflow: z.string().trim().min(20).max(4500),
    attribution: attributionSchema.optional(),
});

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
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

function sanitizeHeader(text: string): string {
    return text.replace(/[\r\n]+/g, ' ').trim();
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL,
        pass: serverConfig.EMAIL_PASS,
    },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const parsed = contactSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid form submission' });
        }

        const { name, email, company, budget, workflow, attribution } =
            parsed.data;

        const sanitizedName = escapeHtml(name);
        const sanitizedEmail = escapeHtml(email);
        const sanitizedCompany = escapeHtml(company);
        const sanitizedBudget = escapeHtml(budget || 'Not specified');
        const sanitizedWorkflow = escapeHtml(workflow);
        const sanitizedAttribution = {
            landingPage: escapeHtml(attribution?.landingPage || 'Unknown'),
            referrer: escapeHtml(attribution?.referrer || 'Direct / unknown'),
            utmSource: escapeHtml(attribution?.utmSource || 'None'),
            utmMedium: escapeHtml(attribution?.utmMedium || 'None'),
            utmCampaign: escapeHtml(attribution?.utmCampaign || 'None'),
        };

        const mailOptions = {
            from: '"Contact Form" <no-reply@hultman.dev>',
            to: process.env.NEXT_PUBLIC_EMAIL,
            replyTo: email,
            subject: `New workflow inquiry · ${sanitizeHeader(company)}`,
            text: [
                'New qualified workflow inquiry',
                '',
                `Name: ${name}`,
                `Email: ${email}`,
                `Company: ${company}`,
                `Budget: ${budget || 'Not specified'}`,
                '',
                'Workflow:',
                workflow,
                '',
                'Attribution:',
                `Landing page: ${attribution?.landingPage || 'Unknown'}`,
                `Referrer: ${attribution?.referrer || 'Direct / unknown'}`,
                `UTM source: ${attribution?.utmSource || 'None'}`,
                `UTM medium: ${attribution?.utmMedium || 'None'}`,
                `UTM campaign: ${attribution?.utmCampaign || 'None'}`,
            ].join('\n'),
            html: `
                <h1>New qualified workflow inquiry</h1>
                <p><strong>Name:</strong> ${sanitizedName}</p>
                <p><strong>Email:</strong> ${sanitizedEmail}</p>
                <p><strong>Company:</strong> ${sanitizedCompany}</p>
                <p><strong>Budget:</strong> ${sanitizedBudget}</p>
                <p><strong>Workflow:</strong></p>
                <p>${sanitizedWorkflow.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><strong>Landing page:</strong> ${sanitizedAttribution.landingPage}</p>
                <p><strong>Referrer:</strong> ${sanitizedAttribution.referrer}</p>
                <p><strong>UTM:</strong> ${sanitizedAttribution.utmSource} / ${sanitizedAttribution.utmMedium} / ${sanitizedAttribution.utmCampaign}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        // Track successful contact form submission server-side
        const posthog = getPostHogClient();
        posthog?.capture({
            distinctId: createHash('sha256').update(email).digest('hex'),
            event: 'server_contact_submitted',
            properties: {
                source: 'api',
                budget: budget || 'unspecified',
                has_referrer: Boolean(attribution?.referrer),
                utm_source: attribution?.utmSource || undefined,
                utm_medium: attribution?.utmMedium || undefined,
                utm_campaign: attribution?.utmCampaign || undefined,
            },
        });

        return res.status(200).json({ message: 'Form submission successful' });
    } catch (error) {
        console.error('Error handling contact form submission:', error);

        // Track failed contact form submission server-side
        const posthog = getPostHogClient();
        posthog?.capture({
            distinctId: 'anonymous',
            event: 'server_contact_failed',
            properties: {
                error_message:
                    error instanceof Error ? error.message : String(error),
                source: 'api',
            },
        });

        return res.status(500).json({ message: 'Internal server error' });
    }
}
