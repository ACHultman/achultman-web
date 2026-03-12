const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in minutes from an array of Notion blocks.
 * Extracts plain text from rich_text arrays in paragraph, heading,
 * bulleted/numbered list item, quote, callout, and toggle blocks.
 */
export function estimateReadingTime(
    blocks: { type?: string; [key: string]: any }[]
): number {
    let wordCount = 0;

    for (const block of blocks) {
        const type = block.type;
        if (!type) continue;

        const content = block[type];
        if (!content) continue;

        // Extract text from rich_text arrays
        const richText: { plain_text?: string }[] =
            content.rich_text ?? content.text ?? [];

        for (const segment of richText) {
            if (segment.plain_text) {
                wordCount += segment.plain_text.split(/\s+/).filter(Boolean).length;
            }
        }
    }

    return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
