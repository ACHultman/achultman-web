import { INIT_PROMPT_CHOICES } from '../../constants/chat';

export function generateSuggestions(currentIndex: number): string[] {
    const groupSize = 4;
    const numGroups = Math.floor(INIT_PROMPT_CHOICES.length / groupSize);
    if (numGroups === 0) return [];

    const groupIndex = Math.floor(currentIndex / groupSize) % numGroups;
    const start = groupIndex * groupSize;
    return INIT_PROMPT_CHOICES.slice(start, start + 3);
}
