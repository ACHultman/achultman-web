/** Only deliberate web links may cross the CMS-to-browser boundary. */
export function safeUrl(
    value: unknown,
    navigation = false
): string | undefined {
    if (typeof value !== 'string' || /[\u0000-\u0020\u007f]/.test(value))
        return;
    try {
        const url = new URL(value);
        if (url.username || url.password) return;
        if (
            url.protocol === 'https:' ||
            (navigation && ['http:', 'mailto:'].includes(url.protocol))
        ) {
            return url.href;
        }
    } catch {
        // Invalid and relative CMS URLs remain plain text.
    }
}
