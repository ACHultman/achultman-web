export interface RegexInput {
    pattern: string;
    flags: string;
    text: string;
}

export interface RegexMatch {
    text: string;
    index: number;
    groups: Array<string | undefined>;
}

export type RegexResult =
    { matches: RegexMatch[]; truncated: boolean } | { error: string };

export const MAX_PATTERN = 500;
export const MAX_TEXT = 10_000;
export const MAX_MATCHES = 100;

// Call only inside a disposable worker: valid patterns can take unbounded CPU.
export function evaluateRegex(input: RegexInput): RegexResult {
    if (input.pattern.length > MAX_PATTERN || input.text.length > MAX_TEXT) {
        return {
            error: 'Use a pattern of at most 500 characters and text of at most 10,000 characters.',
        };
    }
    if (!/^[gimsu]*$/.test(input.flags)) {
        return { error: 'Supported flags are g, i, m, s, and u.' };
    }
    try {
        const expression = new RegExp(input.pattern, input.flags);
        const matches: RegexMatch[] = [];
        if (expression.global) {
            // matchAll advances correctly after empty matches, including Unicode.
            for (const match of input.text.matchAll(expression)) {
                if (matches.length === MAX_MATCHES) {
                    return { matches, truncated: true };
                }
                matches.push({
                    text: match[0],
                    index: match.index,
                    groups: match
                        .slice(1, 21)
                        .map((group) =>
                            group === undefined
                                ? undefined
                                : group.length > 500
                                  ? `${group.slice(0, 500)}…`
                                  : group
                        ),
                });
            }
        } else {
            const match = expression.exec(input.text);
            if (match)
                matches.push({
                    text: match[0],
                    index: match.index,
                    groups: match
                        .slice(1, 21)
                        .map((group) =>
                            group === undefined
                                ? undefined
                                : group.length > 500
                                  ? `${group.slice(0, 500)}…`
                                  : group
                        ),
                });
        }
        return { matches, truncated: false };
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : 'Invalid regular expression.',
        };
    }
}
