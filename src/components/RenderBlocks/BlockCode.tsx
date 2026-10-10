import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { highlightCode } from '../../utils/highlightCode';

function BlockCode({ block }: WithContentValidationProps) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const timer = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => () => clearTimeout(timer.current), []);

    const text =
        block.content?.text
            .map((segment) => segment.plain_text || '')
            .join('') ?? '';
    const language = block.content?.language || 'Code';
    const highlighted = useMemo(
        () => highlightCode(text, language),
        [text, language]
    );

    if (!block.content) return null;

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
