const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in minutes from an array of Notion blocks.
 * Extracts plain text from rich_text arrays in paragraph, heading,
 * bulleted/numbered list item, quote, callout, and toggle blocks.
 */
export function estimateReadingTime(
    blocks: { type?: string; [key: string]: unknown }[]
): number {
    let wordCount = 0;

    for (const block of blocks) {
        const type = block.type;
        if (!type) continue;

        const content = block[type];
        if (!content || typeof content !== 'object') continue;

        // Extract text from rich_text arrays
        const richText =
            ('rich_text' in content ? content.rich_text : undefined) ??
            ('text' in content ? content.text : undefined);
        if (!Array.isArray(richText)) continue;

        for (const segment of richText) {
            if (
                segment &&
                typeof segment === 'object' &&
                'plain_text' in segment &&
                typeof segment.plain_text === 'string'
            ) {
                wordCount += segment.plain_text
                    .split(/\s+/)
                    .filter(Boolean).length;
            }
        }
    }

    return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
