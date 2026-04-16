const DEFAULT_MARKDOWN = `# Welcome to MarkView

> A production-grade Markdown Editor with Live Preview, Click-to-Line Sync, and more.

---

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

---

## Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~.

Combined: **_bold and italic_** and **~~bold strikethrough~~**.

---

## Lists

### Unordered List

- Item one
- Item two
  - Nested item A
  - Nested item B
    - Deep nested item
- Item three

### Ordered List

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2
3. Third item

### Task List

- [x] Set up Next.js project
- [x] Install Monaco Editor
- [x] Add live preview
- [ ] Ship to production
- [ ] Celebrate

---

## Code

Inline code: \`const greeting = "Hello, World!";\`

### Code Block (JavaScript)

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);
\`\`\`

### Code Block (Python)

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`

### Code Block (CSS)

\`\`\`css
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
\`\`\`

---

## Tables

| Feature        | Status  | Priority |
|----------------|---------|----------|
| Monaco Editor  | Done    | High     |
| Live Preview   | Done    | High     |
| Click Sync     | Done    | High     |
| Mermaid Charts | Done    | Medium   |
| Import/Export  | Done    | Medium   |
| Dark Mode      | Done    | Low      |

---

## Links & Images

[Visit GitHub](https://github.com) — opens in a new tab.

[Next.js Docs](https://nextjs.org/docs)

![Placeholder Image](https://placehold.co/600x200/1e293b/94a3b8?text=MarkView+Editor)

---

## Blockquotes

> "Any sufficiently advanced technology is indistinguishable from magic."
> — Arthur C. Clarke

> Nested blockquote:
> > This is nested
> > > And even deeper

---

## Horizontal Rule

---

## Mermaid Diagram

\`\`\`mermaid
graph TD
    A[User writes Markdown] --> B{Editor}
    B --> C[Monaco Editor]
    C --> D[Real-time Parse]
    D --> E[Live Preview]
    E --> F{User clicks preview}
    F --> G[Read data-line]
    G --> H[Jump to editor line]
    H --> C
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant E as Editor
    participant P as Preview
    U->>E: Type markdown
    E->>P: Update content
    P->>P: Re-render
    U->>P: Click element
    P->>E: Reveal line
\`\`\`

---

## Footnotes & Extended Syntax

This text has a footnote[^1].

[^1]: This is the footnote content.

---

*Happy writing!* ✨
`;

export default DEFAULT_MARKDOWN;
