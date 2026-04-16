You are a senior frontend engineer. Build a **production-grade Markdown Editor + Live Previewer** using **Next.js (App Router), React, and Tailwind CSS**.

This is NOT a demo. Deliver complete, clean, scalable code with proper architecture.

---

# STEP 1 — SYSTEM DESIGN (DO FIRST)

Before writing code, briefly outline:

- Component architecture
- State management strategy
- How editor ↔ preview sync will work
- How click-to-line mapping will be implemented

Keep this concise but technically precise.

---

# STEP 2 — CORE IMPLEMENTATION

## Layout

- Full-screen responsive app
- Desktop: 2-column split (50/50)
- Left: Markdown editor
- Right: Live preview
- Mobile: stacked or toggle mode
- Sticky top toolbar

---

## Editor (LEFT)

Use **Monaco Editor**.

Features:

- Markdown syntax highlighting
- Line numbers
- Word wrap
- Cursor tracking
- Selection support
- Keyboard shortcuts

Initialize with rich default markdown including:

- headings (h1–h6)
- bold / italic / strikethrough
- inline + block code
- bullet + numbered lists
- task lists
- tables
- links
- images
- blockquotes
- horizontal rules
- mermaid diagram example

---

## Preview (RIGHT)

Use:

- `react-markdown`
- `remark-gfm`
- `rehype-highlight`
- `rehype-sanitize`

Requirements:

- Real-time rendering (no lag)
- GitHub-style formatting
- Styled tables, code blocks, lists
- External links open in new tab
- Syntax highlighting

---

## CRITICAL FEATURE — CLICK → LINE SYNC

You MUST implement this properly.

### Behavior:

- User clicks any element in preview
- Editor jumps to corresponding markdown line
- Editor scrolls to that line
- Line is highlighted briefly

### Implementation Strategy:

- During markdown parsing, attach `data-line` attributes to rendered nodes
- Track line numbers using a custom remark plugin OR AST traversal
- On preview click:
  - read `data-line`
  - call Monaco `revealLineInCenter`
  - set cursor position

This mapping must be accurate enough for real usage.

---

## REAL-TIME SYNC

- Editor updates preview instantly
- Avoid full re-renders when possible
- Use memoization where helpful

---

## TOOLBAR

Buttons to insert markdown syntax:

- Heading
- Bold / Italic / Strike
- Code / Code block
- Link
- Image
- Quote
- List (ordered/unordered)
- Task list
- Table
- Divider

Behavior:

- Wrap selected text if exists
- Otherwise insert template

---

## IMPORT / EXPORT

### Import:

- Accept `.md` files
- Load content into editor

### Export:

- Download `.md`
- Optional: HTML export

Use Blob / File APIs.

---

## MERMAID SUPPORT

Support fenced blocks:

````md
```mermaid
graph TD
A --> B

Render properly in preview using Mermaid.

PERSISTENCE
Auto-save to localStorage
Restore on reload
Reset button
UX / UI
Clean developer-tool style
Tailwind-based
Proper spacing & typography
Scroll sync behavior (optional bonus)
Toast feedback for actions
Dark mode support
SECURITY
Sanitize markdown output
Prevent unsafe HTML injection
STEP 3 — PROJECT STRUCTURE

Use a clean structure like:

/app
/components
  EditorPane.jsx
  PreviewPane.jsx
  Toolbar.jsx
  Layout.jsx
/lib
  markdownParser.js
  lineMapper.js
  storage.js
  fileUtils.js
/styles
STEP 4 — CODE REQUIREMENTS
Use functional React components
No TypeScript (use JSX)
Tailwind for styling
Keep code modular and readable
Avoid unnecessary abstractions
Ensure no runtime errors
STEP 5 — OUTPUT FORMAT

Provide:

Folder structure
Full code (all files)
Installation steps
Run instructions
IMPORTANT RULES
Do NOT simplify the app
Do NOT skip click-to-line sync
Do NOT give partial code
Do NOT omit dependencies
Build as if this will be shipped
FINAL GOAL

A user can:

Write markdown (left)
See live preview (right)
Click preview → jump to source line
Import/export files
Use toolbar to format quickly
Work with tables, lists, links, code, and diagrams smoothly
```
````
