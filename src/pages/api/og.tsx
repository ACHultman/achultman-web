import { ImageResponse } from 'next/og';
import type { NextApiRequest, NextApiResponse } from 'next';

const BG = '#F5F4EF';
const ACCENT = '#2D6658';
const MUTED = '#58635E';

/**
 * Generates a branded 1200x630 share card for blog posts at request time, so
 * every social unfurl looks polished regardless of whether the post has a
 * (potentially expired) Notion cover image.
 *
 * Usage: /api/og?title=<post title>
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD');
        return res.status(405).end();
    }
    const title = (
        typeof req.query.title === 'string' && req.query.title
            ? req.query.title
            : 'Adam Hultman'
    ).slice(0, 110);

    const image = new ImageResponse(
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: BG,
                padding: '80px',
                fontFamily: 'sans-serif',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    fontSize: 34,
                    fontWeight: 700,
                    color: ACCENT,
                }}
            >
                hultman.dev
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        display: 'flex',
                        width: 84,
                        height: 2,
                        backgroundColor: ACCENT,
                        marginBottom: 32,
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        fontSize: title.length > 60 ? 54 : 64,
                        fontWeight: 700,
                        color: '#182522',
                        lineHeight: 1.2,
                    }}
                >
                    {title}
                </div>
            </div>
            <div style={{ display: 'flex', fontSize: 28, color: MUTED }}>
                Adam Hultman / Vancouver, BC
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            headers: {
                'cache-control':
                    'public, max-age=604800, stale-while-revalidate=86400',
            },
        }
    );
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
        'Cache-Control',
        'public, max-age=604800, stale-while-revalidate=86400'
    );
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(Buffer.from(await image.arrayBuffer()));
}
