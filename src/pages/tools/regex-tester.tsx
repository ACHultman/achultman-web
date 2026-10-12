import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import { toolPages } from '../../data/toolPages';
import { MAX_PATTERN, MAX_TEXT, type RegexResult } from '../../lib/tools/regex';

export default function RegexTester() {
    const [pattern, setPattern] = useState('.*@.*\\.com');
    const [flags, setFlags] = useState('g');
    const [text, setText] = useState('user@email.com');
    const [result, setResult] = useState<RegexResult | null>(null);
    const [running, setRunning] = useState(false);
    const worker = useRef<Worker | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function stop() {
        worker.current?.terminate();
        worker.current = null;
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
    }

    useEffect(() => stop, []);

    function invalidate() {
        stop();
        setRunning(false);
        setResult(null);
    }

    function run(event: FormEvent) {
        event.preventDefault();
        stop();
        setResult(null);
        setRunning(true);
        try {
            const current = new Worker(
                new URL('../../workers/regex.worker.ts', import.meta.url)
            );
            worker.current = current;
            const finish = (value: RegexResult) => {
                if (worker.current !== current) return;
                stop();
                setRunning(false);
                setResult(value);
            };
            current.onmessage = (message: MessageEvent<RegexResult>) =>
                finish(message.data);
            current.onerror = () =>
                finish({
                    error: 'The regex worker could not run. Try reloading the page.',
                });
            timer.current = setTimeout(
                () =>
                    finish({
                        error: 'Stopped after one second. Simplify the pattern or shorten the text, then try again.',
                    }),
                1000
            );
            current.postMessage({ pattern, flags, text });
        } catch {
            stop();
            setRunning(false);
            setResult({
                error: 'Your browser could not start the regex worker.',
            });
        }
    }

    return (
        <>
            <PageSeo {...toolPages['regex-tester']} />
            <div className="page-container regex-tool">
                <PageIntro label="Tools" title="Regex tester.">
                    Uses your browser’s JavaScript regex engine. Patterns run in
                    a separate worker with a one-second time limit. Your text
                    stays in your browser.
                </PageIntro>
                <form onSubmit={run} className="regex-form">
                    <label htmlFor="regex-pattern">Pattern</label>
                    <input
                        id="regex-pattern"
                        value={pattern}
                        maxLength={MAX_PATTERN}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        onChange={(event) => {
                            invalidate();
                            setPattern(event.target.value);
                        }}
                        aria-describedby="regex-pattern-help"
                    />
                    <p id="regex-pattern-help">
                        Enter the pattern without surrounding slashes. Maximum
                        500 characters.
                    </p>
                    <label htmlFor="regex-flags">Flags</label>
                    <input
                        id="regex-flags"
                        value={flags}
                        maxLength={5}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        onChange={(event) => {
                            invalidate();
                            setFlags(event.target.value);
                        }}
                        aria-describedby="regex-flags-help"
                    />
                    <p id="regex-flags-help">
                        g: all matches · i: ignore case · m: multiline · s: dot
                        matches newlines · u: Unicode. Without g, returns the
                        first match.
                    </p>
                    <label htmlFor="regex-text">Test text</label>
                    <textarea
                        id="regex-text"
                        rows={6}
                        value={text}
                        maxLength={MAX_TEXT}
                        spellCheck={false}
                        onChange={(event) => {
                            invalidate();
                            setText(event.target.value);
                        }}
                        aria-describedby="regex-text-help"
                    />
                    <p id="regex-text-help">
                        Maximum 10,000 characters. Match positions use
                        JavaScript’s zero-based UTF-16 indices.
                    </p>
                    <button
                        className="button-primary"
                        type="submit"
                        disabled={running}
                    >
                        Test pattern
                    </button>
                </form>
                <p className="regex-status" role="status">
                    {running
                        ? 'Testing…'
                        : result && 'matches' in result
                          ? `${result.matches.length} ${result.matches.length === 1 ? 'match' : 'matches'}${result.truncated ? ' shown (first 100 only)' : ''}.`
                          : 'Ready to test.'}
                </p>
                {result && 'error' in result && (
                    <p className="regex-error" role="alert">
                        {result.error}
                    </p>
                )}
                {result && 'matches' in result && result.matches.length > 0 && (
                    <section aria-label="Matches">
                        <h2>Matches</h2>
                        <p>
                            Capture groups show the first 20 groups, up to 500
                            characters each.
                        </p>
                        <ol className="regex-matches">
                            {result.matches.map((match, index) => (
                                <li key={`${match.index}-${index}`}>
                                    <p>
                                        Position {match.index}–
                                        {match.index + match.text.length}
                                    </p>
                                    <pre>{match.text || '(empty match)'}</pre>
                                    {match.groups.length > 0 && (
                                        <ol aria-label="Capture groups">
                                            {match.groups.map(
                                                (group, groupIndex) => (
                                                    <li key={groupIndex}>
                                                        <code>
                                                            {group === undefined
                                                                ? '(unmatched)'
                                                                : group === ''
                                                                  ? '(empty)'
                                                                  : group}
                                                        </code>
                                                    </li>
                                                )
                                            )}
                                        </ol>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </section>
                )}
                <TextLink href="/tools">All tools</TextLink>
            </div>
        </>
    );
}
