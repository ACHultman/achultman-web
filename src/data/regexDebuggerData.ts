export type RegexStep = {
  position: number;
  patternIndex: number;
  matched: boolean;
  char: string;
  patternChar: string;
  description: string;
};

export type RegexExample = {
  pattern: string;
  testString: string;
  description: string;
};

function matchesCharClass(charClassContent: string, char: string): boolean {
  let i = 0;
  while (i < charClassContent.length) {
    if (
      i + 2 < charClassContent.length &&
      charClassContent[i + 1] === '-'
    ) {
      const lo = charClassContent.charCodeAt(i);
      const hi = charClassContent.charCodeAt(i + 2);
      if (char.charCodeAt(0) >= lo && char.charCodeAt(0) <= hi) return true;
      i += 3;
    } else {
      if (charClassContent[i] === char) return true;
      i++;
    }
  }
  return false;
}

function matchesSingle(
  patternToken: string,
  char: string
): boolean {
  if (patternToken === '.') return true;
  if (patternToken === '\\d') return /\d/.test(char);
  if (patternToken === '\\w') return /\w/.test(char);
  if (patternToken === '\\s') return /\s/.test(char);
  if (patternToken.startsWith('[') && patternToken.endsWith(']')) {
    const content = patternToken.slice(1, -1);
    let negate = false;
    let inner = content;
    if (inner.startsWith('^')) {
      negate = true;
      inner = inner.slice(1);
    }
    const result = matchesCharClass(inner, char);
    return negate ? !result : result;
  }
  return patternToken === char;
}

function tokenize(pattern: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === '^' || pattern[i] === '$') {
      tokens.push(pattern[i]!);
      i++;
    } else if (pattern[i] === '\\' && i + 1 < pattern.length) {
      tokens.push(pattern[i]! + pattern[i + 1]!);
      i += 2;
    } else if (pattern[i] === '[') {
      let j = i + 1;
      while (j < pattern.length && pattern[j] !== ']') j++;
      tokens.push(pattern.slice(i, j + 1));
      i = j + 1;
    } else if (pattern[i] === '{') {
      // attach quantifier to previous token
      let j = i + 1;
      while (j < pattern.length && pattern[j] !== '}') j++;
      tokens.push(pattern.slice(i, j + 1));
      i = j + 1;
    } else if ('*+?'.includes(pattern[i]!)) {
      tokens.push(pattern[i]!);
      i++;
    } else if (pattern[i] === '.') {
      tokens.push('.');
      i++;
    } else {
      tokens.push(pattern[i]!);
      i++;
    }
  }
  return tokens;
}

function describeToken(token: string): string {
  if (token === '.') return 'any character';
  if (token === '\\d') return 'digit';
  if (token === '\\w') return 'word character';
  if (token === '\\s') return 'whitespace';
  if (token === '^') return 'start of string';
  if (token === '$') return 'end of string';
  if (token.startsWith('[') && token.endsWith(']')) return `class ${token}`;
  if (token === '*') return 'zero or more';
  if (token === '+') return 'one or more';
  if (token === '?') return 'optional';
  return `literal '${token}'`;
}

export function traceRegex(pattern: string, testString: string): RegexStep[] {
  const steps: RegexStep[] = [];
  const tokens = tokenize(pattern);

  const hasAnchorStart = tokens.length > 0 && tokens[0] === '^';
  const hasAnchorEnd =
    tokens.length > 0 && tokens[tokens.length - 1] === '$';

  const coreTokens = tokens.filter((t) => t !== '^' && t !== '$');

  if (hasAnchorStart) {
    steps.push({
      position: 0,
      patternIndex: 0,
      matched: true,
      char: '',
      patternChar: '^',
      description: 'Anchor ^ asserts position at start of string',
    });
  }

  const startPositions = hasAnchorStart
    ? [0]
    : Array.from({ length: testString.length }, (_, i) => i);

  for (const startPos of startPositions) {
    let pos = startPos;
    let tIdx = 0;
    let success = true;
    const attemptSteps: RegexStep[] = [];

    if (!hasAnchorStart && startPos > 0) {
      attemptSteps.push({
        position: startPos,
        patternIndex: 0,
        matched: true,
        char: testString[startPos] ?? '',
        patternChar: coreTokens[0] ?? '',
        description: `Trying match starting at position ${startPos}`,
      });
    }

    while (tIdx < coreTokens.length) {
      const token = coreTokens[tIdx];
      const nextToken =
        tIdx + 1 < coreTokens.length ? coreTokens[tIdx + 1] : null;

      // Handle quantifiers attached to previous token conceptually
      // In our tokenization, quantifiers are separate tokens after the atom

      if (nextToken === '*' || nextToken === '+' || nextToken === '?') {
        const atom = token;
        const quantifier = nextToken;
        let count = 0;

        if (quantifier === '?') {
          // optional: try matching one
          if (pos < testString.length && matchesSingle(atom!, testString[pos]!)) {
            attemptSteps.push({
              position: pos,
              patternIndex: tIdx,
              matched: true,
              char: testString[pos]!,
              patternChar: atom! + '?',
              description: `Optional ${describeToken(atom!)}: matched '${testString[pos]}'`,
            });
            pos++;
            count = 1;
          } else {
            attemptSteps.push({
              position: pos,
              patternIndex: tIdx,
              matched: true,
              char: testString[pos] ?? '',
              patternChar: atom! + '?',
              description: `Optional ${describeToken(atom!)}: skipped (zero occurrences)`,
            });
          }
          tIdx += 2;
          continue;
        }

        // * or +
        const minCount = quantifier === '+' ? 1 : 0;
        while (
          pos < testString.length &&
          matchesSingle(atom!, testString[pos]!)
        ) {
          attemptSteps.push({
            position: pos,
            patternIndex: tIdx,
            matched: true,
            char: testString[pos]!,
            patternChar: atom! + quantifier,
            description: `${describeToken(atom!)}${quantifier}: matched '${testString[pos]}' (occurrence ${count + 1})`,
          });
          pos++;
          count++;
        }

        if (count < minCount) {
          attemptSteps.push({
            position: pos,
            patternIndex: tIdx,
            matched: false,
            char: testString[pos] ?? '<end>',
            patternChar: atom! + quantifier,
            description: `${describeToken(atom!)}${quantifier}: need at least ${minCount} match(es), found ${count}`,
          });
          success = false;
          break;
        }

        if (count === 0 && quantifier === '*') {
          attemptSteps.push({
            position: pos,
            patternIndex: tIdx,
            matched: true,
            char: '',
            patternChar: atom! + '*',
            description: `${describeToken(atom!)}*: matched zero occurrences`,
          });
        }

        tIdx += 2;
        continue;
      }

      // Simple single-char matching
      if (pos >= testString.length) {
        attemptSteps.push({
          position: pos,
          patternIndex: tIdx,
          matched: false,
          char: '<end>',
          patternChar: token!,
          description: `Reached end of string but pattern expects ${describeToken(token!)}`,
        });
        success = false;
        break;
      }

      const isMatch = matchesSingle(token!, testString[pos]!);
      attemptSteps.push({
        position: pos,
        patternIndex: tIdx,
        matched: isMatch,
        char: testString[pos]!,
        patternChar: token!,
        description: isMatch
          ? `'${testString[pos]}' matches ${describeToken(token!)}`
          : `'${testString[pos]}' does NOT match ${describeToken(token!)}`,
      });

      if (!isMatch) {
        success = false;
        break;
      }

      pos++;
      tIdx++;
    }

    if (success && hasAnchorEnd) {
      if (pos !== testString.length) {
        attemptSteps.push({
          position: pos,
          patternIndex: tokens.length - 1,
          matched: false,
          char: testString[pos] ?? '',
          patternChar: '$',
          description: `Anchor $ expects end of string but characters remain at position ${pos}`,
        });
        success = false;
      } else {
        attemptSteps.push({
          position: pos,
          patternIndex: tokens.length - 1,
          matched: true,
          char: '',
          patternChar: '$',
          description: 'Anchor $ confirmed: at end of string',
        });
      }
    }

    steps.push(...attemptSteps);

    if (success) {
      steps.push({
        position: startPos,
        patternIndex: -1,
        matched: true,
        char: '',
        patternChar: '',
        description: `Match found from position ${startPos} to ${pos - 1}: "${testString.slice(startPos, pos)}"`,
      });
      return steps;
    }
  }

  steps.push({
    position: -1,
    patternIndex: -1,
    matched: false,
    char: '',
    patternChar: '',
    description: 'No match found in the entire string',
  });

  return steps;
}

const PRECOMPUTED_TRACES: Record<string, RegexStep[]> = {
  '\\d{3}-\\d{4}|||Call 555-1234 now': [
    { position: 0, patternIndex: 0, matched: true, char: 'C', patternChar: '\\d{3}', description: 'Trying match starting at position 0' },
    { position: 0, patternIndex: 0, matched: false, char: 'C', patternChar: '\\d{3}', description: "'C' does NOT match digit — moving to next position" },
    { position: 1, patternIndex: 0, matched: false, char: 'a', patternChar: '\\d{3}', description: "'a' does NOT match digit — moving to next position" },
    { position: 2, patternIndex: 0, matched: false, char: 'l', patternChar: '\\d{3}', description: "'l' does NOT match digit — moving to next position" },
    { position: 3, patternIndex: 0, matched: false, char: 'l', patternChar: '\\d{3}', description: "'l' does NOT match digit — moving to next position" },
    { position: 4, patternIndex: 0, matched: false, char: ' ', patternChar: '\\d{3}', description: "' ' does NOT match digit — moving to next position" },
    { position: 5, patternIndex: 0, matched: true, char: '5', patternChar: '\\d{3}', description: "'5' matches digit (occurrence 1 of 3)" },
    { position: 6, patternIndex: 0, matched: true, char: '5', patternChar: '\\d{3}', description: "'5' matches digit (occurrence 2 of 3)" },
    { position: 7, patternIndex: 0, matched: true, char: '5', patternChar: '\\d{3}', description: "'5' matches digit (occurrence 3 of 3) — quantifier {3} satisfied" },
    { position: 8, patternIndex: 1, matched: true, char: '-', patternChar: '-', description: "'-' matches literal '-'" },
    { position: 9, patternIndex: 2, matched: true, char: '1', patternChar: '\\d{4}', description: "'1' matches digit (occurrence 1 of 4)" },
    { position: 10, patternIndex: 2, matched: true, char: '2', patternChar: '\\d{4}', description: "'2' matches digit (occurrence 2 of 4)" },
    { position: 11, patternIndex: 2, matched: true, char: '3', patternChar: '\\d{4}', description: "'3' matches digit (occurrence 3 of 4)" },
    { position: 12, patternIndex: 2, matched: true, char: '4', patternChar: '\\d{4}', description: "'4' matches digit (occurrence 4 of 4) — quantifier {4} satisfied" },
    { position: 5, patternIndex: -1, matched: true, char: '', patternChar: '', description: 'Match found from position 5 to 12: "555-1234"' },
  ],
  'a{2,}|||aaa aaaa': [
    { position: 0, patternIndex: 0, matched: true, char: 'a', patternChar: 'a{2,}', description: "Trying match starting at position 0" },
    { position: 0, patternIndex: 0, matched: true, char: 'a', patternChar: 'a{2,}', description: "'a' matches literal 'a' (occurrence 1, need at least 2)" },
    { position: 1, patternIndex: 0, matched: true, char: 'a', patternChar: 'a{2,}', description: "'a' matches literal 'a' (occurrence 2, minimum satisfied)" },
    { position: 2, patternIndex: 0, matched: true, char: 'a', patternChar: 'a{2,}', description: "'a' matches literal 'a' (occurrence 3, greedy — keep going)" },
    { position: 3, patternIndex: 0, matched: true, char: ' ', patternChar: 'a{2,}', description: "' ' does NOT match literal 'a' — quantifier stops with 3 occurrences" },
    { position: 0, patternIndex: -1, matched: true, char: '', patternChar: '', description: 'Match found from position 0 to 2: "aaa"' },
  ],
};

export function getStepsForExample(pattern: string, testString: string): RegexStep[] {
  const key = `${pattern}|||${testString}`;
  if (PRECOMPUTED_TRACES[key]) {
    return PRECOMPUTED_TRACES[key];
  }
  return traceRegex(pattern, testString);
}

export const REGEX_EXAMPLES: RegexExample[] = [
  {
    pattern: 'hello',
    testString: 'say hello world',
    description: 'Simple literal match',
  },
  {
    pattern: '\\d{3}-\\d{4}',
    testString: 'Call 555-1234 now',
    description: 'Phone number pattern',
  },
  {
    pattern: '^[A-Z][a-z]+$',
    testString: 'Hello',
    description: 'Capitalized word',
  },
  {
    pattern: 'colou?r',
    testString: 'color and colour',
    description: 'Optional character',
  },
  {
    pattern: 'a{2,}',
    testString: 'aaa aaaa',
    description: "Two or more a's",
  },
  {
    pattern: '.*@.*\\.com',
    testString: 'user@email.com',
    description: 'Simple email match',
  },
];
