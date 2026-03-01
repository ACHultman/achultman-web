import { INIT_PROMPT_CHOICES } from '../../constants/chat';

export function generateSuggestions(currentIndex: number): string[] {
    if (INIT_PROMPT_CHOICES.length === 0) {
        return [];
    }

    const nextIndex = currentIndex % INIT_PROMPT_CHOICES.length;
    const suggestion = INIT_PROMPT_CHOICES[nextIndex];
    return suggestion ? [suggestion] : [];
}
