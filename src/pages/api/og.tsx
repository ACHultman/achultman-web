import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = {
    runtime: 'edge',
};

const BG = '#0d1117';
const ACCENT = '#38a169';
const MUTED = '#9ca3af';

/**
 * Generates a branded 1200x630 share card for blog posts at request time, so
 * every social unfurl looks polished regardless of whether the post has a
 * (potentially expired) Notion cover image.
 *
 * Usage: /api/og?title=<post title>
 */
export default function handler(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = (searchParams.get('title') || 'Adam Hultman').slice(0, 110);

    return new ImageResponse(
        (
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
                            height: 6,
                            backgroundColor: ACCENT,
                            marginBottom: 32,
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 64,
                            fontWeight: 700,
                            color: '#ffffff',
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </div>
                </div>
                <div style={{ display: 'flex', fontSize: 28, color: MUTED }}>
                    Adam Hultman — Software Engineer
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            headers: {
                'cache-control':
                    'public, max-age=604800, stale-while-revalidate=86400',
            },
        }
    );
}
