import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { highlightCode } from '../../utils/highlightCode';

function BlockCode({ text, language }: { text: string; language: string }) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);

    const highlighted = useMemo(
        () => highlightCode(text, language),
        [text, language]
    );

    async function copy() {
        clearTimeout(timer.current);
        try {
            await navigator.clipboard.writeText(text);
            setStatus('copied');
        } catch {
            setStatus('error');
        }
        timer.current = setTimeout(() => setStatus('idle'), 3000);
    }

    return (
        <div className="code-block">
            <div className="code-toolbar">
                <span>{language}</span>
                <button type="button" onClick={copy} aria-label="Copy code">
                    {status === 'copied' ? (
                        <FiCheck aria-hidden="true" />
                    ) : (
                        <FiCopy aria-hidden="true" />
                    )}
                    <span aria-live="polite">
                        {status === 'copied'
                            ? 'Copied'
                            : status === 'error'
                              ? 'Select code to copy'
                              : 'Copy'}
                    </span>
                </button>
            </div>
            <pre tabIndex={0} aria-label={`${language} code`}>
                {highlighted ? (
                    // Prism escapes source text before emitting token spans.
                    <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                ) : (
                    <code>{text}</code>
                )}
            </pre>
        </div>
    );
}

export default BlockCode;
