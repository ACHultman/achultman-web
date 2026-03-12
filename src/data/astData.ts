// ---------------------------------------------------------------------------
// Lightweight JavaScript expression / statement parser  (recursive-descent)
// No external deps — built from scratch for the AST Explorer lab.
// ---------------------------------------------------------------------------

export interface ASTNode {
  type: string;
  start: number;
  end: number;
  children: ASTNode[];
  name?: string;
  operator?: string;
  value?: string | number | boolean;
  kind?: string;
}

export interface ParseResult {
  ast: ASTNode;
  errors: { message: string; position: number }[];
}

// ── Token types ──────────────────────────────────────────────────────────────

interface Token {
  type:
    | 'keyword'
    | 'identifier'
    | 'number'
    | 'string'
    | 'operator'
    | 'punctuation'
    | 'eof';
  value: string;
  start: number;
  end: number;
}

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'true',
  'false',
  'null',
  'undefined',
]);

const OPERATORS = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '=',
  '==',
  '===',
  '!=',
  '!==',
  '<',
  '>',
  '<=',
  '>=',
  '&&',
  '||',
  '!',
  '=>',
]);

const PUNCTUATION = new Set([
  '(',
  ')',
  '{',
  '}',
  '[',
  ']',
  ',',
  ';',
  ':',
  '.',
]);

// ── Tokenizer ────────────────────────────────────────────────────────────────

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    // Skip whitespace
    if (/\s/.test(source[i]!)) {
      i++;
      continue;
    }

    // Skip single-line comments
    if (source[i] === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }

    // Skip multi-line comments
    if (source[i] === '/' && source[i + 1] === '*') {
      i += 2;
      while (i < source.length - 1 && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    const start = i;

    // String literals
    if (source[i] === '"' || source[i] === "'" || source[i] === '`') {
      const quote = source[i]!;
      i++;
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i++; // skip escaped char
        i++;
      }
      i++; // closing quote
      tokens.push({
        type: 'string',
        value: source.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(source[i]!)) {
      while (i < source.length && /[0-9.]/.test(source[i]!)) i++;
      tokens.push({
        type: 'number',
        value: source.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    // Identifiers / keywords
    if (/[a-zA-Z_$]/.test(source[i]!)) {
      while (i < source.length && /[a-zA-Z0-9_$]/.test(source[i]!)) i++;
      const word = source.slice(start, i);
      tokens.push({
        type: KEYWORDS.has(word) ? 'keyword' : 'identifier',
        value: word,
        start,
        end: i,
      });
      continue;
    }

    // Multi-char operators (check longest first)
    const three = source.slice(i, i + 3);
    const two = source.slice(i, i + 2);
    if (OPERATORS.has(three)) {
      tokens.push({ type: 'operator', value: three, start, end: i + 3 });
      i += 3;
      continue;
    }
    if (OPERATORS.has(two)) {
      tokens.push({ type: 'operator', value: two, start, end: i + 2 });
      i += 2;
      continue;
    }

    // Single-char operators
    if (OPERATORS.has(source[i]!)) {
      tokens.push({
        type: 'operator',
        value: source[i]!,
        start,
        end: i + 1,
      });
      i++;
      continue;
    }

    // Punctuation
    if (PUNCTUATION.has(source[i]!)) {
      tokens.push({
        type: 'punctuation',
        value: source[i]!,
        start,
        end: i + 1,
      });
      i++;
      continue;
    }

    // Unknown character — skip
    i++;
  }

  tokens.push({ type: 'eof', value: '', start: i, end: i });
  return tokens;
}

// ── Parser ───────────────────────────────────────────────────────────────────

class Parser {
  private tokens: Token[];
  private pos: number = 0;
  errors: { message: string; position: number }[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // Helpers ----------------------------------------------------------------

  private peek(): Token {
    return this.tokens[this.pos]!;
  }

  private advance(): Token {
    const tok = this.tokens[this.pos]!;
    this.pos++;
    return tok;
  }

  private expect(type: Token['type'], value?: string): Token {
    const tok = this.peek();
    if (tok.type !== type || (value !== undefined && tok.value !== value)) {
      this.errors.push({
        message: `Expected ${value ?? type}, got "${tok.value}"`,
        position: tok.start,
      });
      // Return a synthetic token so we don't blow up
      return { type, value: value ?? '', start: tok.start, end: tok.end };
    }
    return this.advance();
  }

  private match(type: Token['type'], value?: string): boolean {
    const tok = this.peek();
    return tok.type === type && (value === undefined || tok.value === value);
  }

  private eat(type: Token['type'], value?: string): Token | null {
    if (this.match(type, value)) return this.advance();
    return null;
  }

  // Program ----------------------------------------------------------------

  parseProgram(): ASTNode {
    const start = this.peek().start;
    const children: ASTNode[] = [];

    while (!this.match('eof')) {
      try {
        children.push(this.parseStatement());
      } catch {
        // Skip the offending token and try to continue
        if (!this.match('eof')) {
          const bad = this.advance();
          this.errors.push({
            message: `Unexpected token "${bad.value}"`,
            position: bad.start,
          });
        }
      }
    }

    return {
      type: 'Program',
      start,
      end: this.peek().end,
      children,
    };
  }

  // Statements -------------------------------------------------------------

  private parseStatement(): ASTNode {
    const tok = this.peek();

    if (
      tok.type === 'keyword' &&
      (tok.value === 'const' || tok.value === 'let' || tok.value === 'var')
    ) {
      return this.parseVariableDeclaration();
    }

    if (tok.type === 'keyword' && tok.value === 'function') {
      return this.parseFunctionDeclaration();
    }

    if (tok.type === 'keyword' && tok.value === 'return') {
      return this.parseReturnStatement();
    }

    if (tok.type === 'keyword' && tok.value === 'if') {
      return this.parseIfStatement();
    }

    // Expression statement
    const expr = this.parseExpression();
    this.eat('punctuation', ';');
    return {
      type: 'ExpressionStatement',
      start: expr.start,
      end: expr.end,
      children: [expr],
    };
  }

  // Variable declaration ---------------------------------------------------

  private parseVariableDeclaration(): ASTNode {
    const kindTok = this.advance(); // const | let | var
    const start = kindTok.start;
    const nameTok = this.expect('identifier');

    const children: ASTNode[] = [
      {
        type: 'Identifier',
        start: nameTok.start,
        end: nameTok.end,
        children: [],
        name: nameTok.value,
      },
    ];

    if (this.eat('operator', '=')) {
      // Check for arrow function: (params) => ...  or  ident => ...
      const init = this.parseAssignmentOrArrow();
      children.push(init);
    }

    this.eat('punctuation', ';');

    return {
      type: 'VariableDeclaration',
      start,
      end: this.tokens[this.pos - 1]!.end,
      children,
      kind: kindTok.value,
    };
  }

  // Function declaration ---------------------------------------------------

  private parseFunctionDeclaration(): ASTNode {
    const start = this.advance().start; // 'function'
    const nameTok = this.expect('identifier');

    const params = this.parseParamList();
    const body = this.parseBlock();

    return {
      type: 'FunctionDeclaration',
      start,
      end: body.end,
      children: [...params, body],
      name: nameTok.value,
    };
  }

  private parseParamList(): ASTNode[] {
    const params: ASTNode[] = [];
    this.expect('punctuation', '(');
    while (!this.match('punctuation', ')') && !this.match('eof')) {
      const p = this.expect('identifier');
      params.push({
        type: 'Parameter',
        start: p.start,
        end: p.end,
        children: [],
        name: p.value,
      });
      if (!this.eat('punctuation', ',')) break;
    }
    this.expect('punctuation', ')');
    return params;
  }

  private parseBlock(): ASTNode {
    const open = this.expect('punctuation', '{');
    const children: ASTNode[] = [];

    while (
      !this.match('punctuation', '}') &&
      !this.match('eof')
    ) {
      try {
        children.push(this.parseStatement());
      } catch {
        if (!this.match('eof') && !this.match('punctuation', '}')) {
          const bad = this.advance();
          this.errors.push({
            message: `Unexpected token "${bad.value}" in block`,
            position: bad.start,
          });
        }
      }
    }

    const close = this.expect('punctuation', '}');
    return {
      type: 'BlockStatement',
      start: open.start,
      end: close.end,
      children,
    };
  }

  // Return -----------------------------------------------------------------

  private parseReturnStatement(): ASTNode {
    const start = this.advance().start; // 'return'
    const children: ASTNode[] = [];

    if (!this.match('punctuation', ';') && !this.match('punctuation', '}') && !this.match('eof')) {
      children.push(this.parseExpression());
    }

    this.eat('punctuation', ';');
    return {
      type: 'ReturnStatement',
      start,
      end: children.length > 0 ? children[children.length - 1]!.end : start + 6,
      children,
    };
  }

  // If / else --------------------------------------------------------------

  private parseIfStatement(): ASTNode {
    const start = this.advance().start; // 'if'
    this.expect('punctuation', '(');
    const condition = this.parseExpression();
    this.expect('punctuation', ')');
    const consequent = this.parseBlock();
    const children: ASTNode[] = [condition, consequent];

    if (this.eat('keyword', 'else')) {
      if (this.match('keyword', 'if')) {
        children.push(this.parseIfStatement());
      } else {
        children.push(this.parseBlock());
      }
    }

    return {
      type: 'IfStatement',
      start,
      end: children[children.length - 1]!.end,
      children,
    };
  }

  // Expressions (precedence climbing) -------------------------------------

  private parseAssignmentOrArrow(): ASTNode {
    // Look-ahead for arrow function: (a, b) => ... or ident => ...
    const saved = this.pos;

    // Single-ident arrow:  x => ...
    if (this.match('identifier')) {
      const ident = this.peek();
      const next = this.tokens[this.pos + 1];
      if (next && next.type === 'operator' && next.value === '=>') {
        this.advance(); // ident
        this.advance(); // =>
        const param: ASTNode = {
          type: 'Parameter',
          start: ident.start,
          end: ident.end,
          children: [],
          name: ident.value,
        };
        const body = this.match('punctuation', '{')
          ? this.parseBlock()
          : this.parseExpression();
        return {
          type: 'ArrowFunctionExpression',
          start: ident.start,
          end: body.end,
          children: [param, body],
        };
      }
    }

    // Parenthesized params arrow: (a, b) => ...
    if (this.match('punctuation', '(')) {
      // Try to parse as arrow params
      const parenStart = this.peek().start;
      try {
        const params = this.parseArrowParams();
        if (this.eat('operator', '=>')) {
          const body = this.match('punctuation', '{')
            ? this.parseBlock()
            : this.parseExpression();
          return {
            type: 'ArrowFunctionExpression',
            start: parenStart,
            end: body.end,
            children: [...params, body],
          };
        }
      } catch {
        // Not arrow params — fall through
      }
      // Restore and parse as normal expression
      this.pos = saved;
    }

    return this.parseExpression();
  }

  private parseArrowParams(): ASTNode[] {
    const params: ASTNode[] = [];
    this.expect('punctuation', '(');
    while (!this.match('punctuation', ')') && !this.match('eof')) {
      const p = this.expect('identifier');
      params.push({
        type: 'Parameter',
        start: p.start,
        end: p.end,
        children: [],
        name: p.value,
      });
      if (!this.eat('punctuation', ',')) break;
    }
    this.expect('punctuation', ')');
    return params;
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ASTNode {
    const left = this.parseOr();

    if (this.match('operator', '=') && left.type === 'Identifier') {
      this.advance();
      const right = this.parseAssignment();
      return {
        type: 'AssignmentExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: '=',
      };
    }

    return left;
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();
    while (this.eat('operator', '||')) {
      const right = this.parseAnd();
      left = {
        type: 'BinaryExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: '||',
      };
    }
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseEquality();
    while (this.eat('operator', '&&')) {
      const right = this.parseEquality();
      left = {
        type: 'BinaryExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: '&&',
      };
    }
    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseComparison();
    while (
      this.match('operator', '==') ||
      this.match('operator', '===') ||
      this.match('operator', '!=') ||
      this.match('operator', '!==')
    ) {
      const op = this.advance();
      const right = this.parseComparison();
      left = {
        type: 'BinaryExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: op.value,
      };
    }
    return left;
  }

  private parseComparison(): ASTNode {
    let left = this.parseAdditive();
    while (
      this.match('operator', '<') ||
      this.match('operator', '>') ||
      this.match('operator', '<=') ||
      this.match('operator', '>=')
    ) {
      const op = this.advance();
      const right = this.parseAdditive();
      left = {
        type: 'BinaryExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: op.value,
      };
    }
    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();
    while (this.match('operator', '+') || this.match('operator', '-')) {
      const op = this.advance();
      const right = this.parseMultiplicative();
      left = {
        type: 'BinaryExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: op.value,
      };
    }
    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parseUnary();
    while (
      this.match('operator', '*') ||
      this.match('operator', '/') ||
      this.match('operator', '%')
    ) {
      const op = this.advance();
      const right = this.parseUnary();
      left = {
        type: 'BinaryExpression',
        start: left.start,
        end: right.end,
        children: [left, right],
        operator: op.value,
      };
    }
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.match('operator', '!') || this.match('operator', '-')) {
      const op = this.advance();
      const operand = this.parseUnary();
      return {
        type: 'UnaryExpression',
        start: op.start,
        end: operand.end,
        children: [operand],
        operator: op.value,
      };
    }
    return this.parseCallOrMember();
  }

  private parseCallOrMember(): ASTNode {
    let node = this.parsePrimary();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.match('punctuation', '(')) {
        // Function call
        this.advance();
        const args: ASTNode[] = [];
        while (!this.match('punctuation', ')') && !this.match('eof')) {
          args.push(this.parseExpression());
          if (!this.eat('punctuation', ',')) break;
        }
        const close = this.expect('punctuation', ')');
        node = {
          type: 'CallExpression',
          start: node.start,
          end: close.end,
          children: [node, ...args],
          name: node.name,
        };
      } else if (this.match('punctuation', '.')) {
        this.advance();
        const prop = this.expect('identifier');
        node = {
          type: 'MemberExpression',
          start: node.start,
          end: prop.end,
          children: [node],
          name: prop.value,
        };
      } else if (this.match('punctuation', '[')) {
        this.advance();
        const index = this.parseExpression();
        const close = this.expect('punctuation', ']');
        node = {
          type: 'MemberExpression',
          start: node.start,
          end: close.end,
          children: [node, index],
        };
      } else {
        break;
      }
    }

    return node;
  }

  private parsePrimary(): ASTNode {
    const tok = this.peek();

    // Number literal
    if (tok.type === 'number') {
      this.advance();
      return {
        type: 'NumericLiteral',
        start: tok.start,
        end: tok.end,
        children: [],
        value: Number(tok.value),
      };
    }

    // String literal
    if (tok.type === 'string') {
      this.advance();
      return {
        type: 'StringLiteral',
        start: tok.start,
        end: tok.end,
        children: [],
        value: tok.value.slice(1, -1), // strip quotes
      };
    }

    // Boolean / null / undefined
    if (tok.type === 'keyword' && (tok.value === 'true' || tok.value === 'false')) {
      this.advance();
      return {
        type: 'BooleanLiteral',
        start: tok.start,
        end: tok.end,
        children: [],
        value: tok.value === 'true',
      };
    }

    if (tok.type === 'keyword' && (tok.value === 'null' || tok.value === 'undefined')) {
      this.advance();
      return {
        type: 'NullLiteral',
        start: tok.start,
        end: tok.end,
        children: [],
        value: tok.value,
      };
    }

    // Identifier
    if (tok.type === 'identifier') {
      this.advance();
      return {
        type: 'Identifier',
        start: tok.start,
        end: tok.end,
        children: [],
        name: tok.value,
      };
    }

    // Parenthesized expression
    if (tok.type === 'punctuation' && tok.value === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.expect('punctuation', ')');
      return expr;
    }

    // Array literal
    if (tok.type === 'punctuation' && tok.value === '[') {
      return this.parseArrayLiteral();
    }

    // Object literal
    if (tok.type === 'punctuation' && tok.value === '{') {
      return this.parseObjectLiteral();
    }

    // Fallback — produce an error node
    this.advance();
    this.errors.push({
      message: `Unexpected token "${tok.value}"`,
      position: tok.start,
    });
    return {
      type: 'Error',
      start: tok.start,
      end: tok.end,
      children: [],
    };
  }

  // Array literal ----------------------------------------------------------

  private parseArrayLiteral(): ASTNode {
    const open = this.advance(); // '['
    const elements: ASTNode[] = [];
    while (!this.match('punctuation', ']') && !this.match('eof')) {
      elements.push(this.parseExpression());
      if (!this.eat('punctuation', ',')) break;
    }
    const close = this.expect('punctuation', ']');
    return {
      type: 'ArrayExpression',
      start: open.start,
      end: close.end,
      children: elements,
    };
  }

  // Object literal ---------------------------------------------------------

  private parseObjectLiteral(): ASTNode {
    const open = this.advance(); // '{'
    const properties: ASTNode[] = [];
    while (!this.match('punctuation', '}') && !this.match('eof')) {
      const keyTok =
        this.peek().type === 'string' ? this.advance() : this.expect('identifier');
      const key: ASTNode = {
        type: keyTok.type === 'string' ? 'StringLiteral' : 'Identifier',
        start: keyTok.start,
        end: keyTok.end,
        children: [],
        name: keyTok.value.replace(/^['"]|['"]$/g, ''),
        value: keyTok.type === 'string' ? keyTok.value.slice(1, -1) : undefined,
      };
      this.expect('punctuation', ':');
      const val = this.parseExpression();
      properties.push({
        type: 'Property',
        start: key.start,
        end: val.end,
        children: [key, val],
      });
      if (!this.eat('punctuation', ',')) break;
    }
    const close = this.expect('punctuation', '}');
    return {
      type: 'ObjectExpression',
      start: open.start,
      end: close.end,
      children: properties,
    };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function parse(source: string): ParseResult {
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();
  return { ast, errors: parser.errors };
}

// ── Utility helpers ──────────────────────────────────────────────────────────

/** Count all nodes in a tree. */
export function countNodes(node: ASTNode): number {
  let count = 1;
  for (const child of node.children) {
    count += countNodes(child);
  }
  return count;
}

/** Compute max depth of the tree. */
export function treeDepth(node: ASTNode): number {
  if (node.children.length === 0) return 1;
  let max = 0;
  for (const child of node.children) {
    const d = treeDepth(child);
    if (d > max) max = d;
  }
  return 1 + max;
}

/** Find the deepest (most specific) node that covers a character offset. */
export function findNodeAtOffset(
  node: ASTNode,
  offset: number,
): ASTNode | null {
  if (offset < node.start || offset >= node.end) return null;
  for (const child of node.children) {
    const found = findNodeAtOffset(child, offset);
    if (found) return found;
  }
  return node;
}

// ── Color mapping by node type ───────────────────────────────────────────────

export function nodeColorScheme(type: string): string {
  if (type.includes('Declaration') || type === 'VariableDeclaration') return 'blue';
  if (type.includes('Expression') || type === 'CallExpression') return 'green';
  if (type.includes('Literal')) return 'orange';
  if (type.includes('Statement') || type === 'Program' || type === 'BlockStatement')
    return 'purple';
  if (type === 'Identifier' || type === 'Parameter') return 'cyan';
  if (type === 'Property') return 'teal';
  return 'gray';
}

// ── Example snippets ─────────────────────────────────────────────────────────

export const EXAMPLES: { name: string; code: string }[] = [
  {
    name: 'Variables',
    code: 'const x = 42;\nlet y = "hello";\nvar z = true;',
  },
  {
    name: 'Functions',
    code: 'function add(a, b) {\n  return a + b;\n}\n\nconst result = add(1, 2);',
  },
  {
    name: 'Arrow Functions',
    code: 'const square = (x) => x * x;\nconst greet = (name) => "Hello " + name;',
  },
  {
    name: 'Conditionals',
    code: 'const x = 10;\nif (x > 5) {\n  const big = true;\n} else {\n  const big = false;\n}',
  },
  {
    name: 'Objects & Arrays',
    code: 'const obj = { name: "Ada", age: 36 };\nconst arr = [1, 2, 3];',
  },
  {
    name: 'Complex',
    code: 'function fibonacci(n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
  },
];
