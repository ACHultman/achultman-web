import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

// React owns the markup; Prism must not mutate the document during hydration.
Prism.manual = true;

export function highlightCode(text: string, language: string): string | null {
    const key = language.toLowerCase();
    const grammar = Prism.languages[key];
    // Unknown Notion languages remain readable plain text.
    return grammar ? Prism.highlight(text, grammar, key) : null;
}
