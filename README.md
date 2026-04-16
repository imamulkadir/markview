# MarkView

A production-grade Markdown editor with a live preview. Built with Next.js 16, React 19, and Tailwind CSS v4. Installable as a PWA.

## Features

**Editor**
- Monaco Editor (VS Code engine) with Markdown syntax highlighting
- Line numbers, word wrap, smooth cursor
- Keyboard shortcuts: `Ctrl+B` bold · `Ctrl+I` italic · `Ctrl+K` link

**Preview**
- Real-time rendering via `react-markdown` + `remark-gfm`
- GitHub Flavored Markdown: tables, task lists, strikethrough, autolinks
- Syntax-highlighted code blocks (`rehype-highlight`)
- Sanitized output — unsafe HTML is stripped (`rehype-sanitize`)
- External links open in a new tab

**Click-to-Line Sync**
- Click any element in the preview pane to jump to its source line in the editor
- Custom remark plugin injects `data-line` attributes during AST traversal
- Monaco's `revealLineInCenter` scrolls and highlights the target line

**Toolbar**
- One-click insert/wrap for: H1–H3, Bold, Italic, Strikethrough, Inline code, Code block, Blockquote, HR, Bullet list, Numbered list, Task list, Link, Image, Table

**Mermaid Diagrams**
- Fenced ` ```mermaid ` blocks render as live diagrams (flowcharts, sequence, etc.)
- Lazy-loaded — diagram library only downloads when the page contains a Mermaid block

**Import / Export**
- Import `.md` / `.markdown` files from disk
- Export as `.md` (raw Markdown)
- Export as `.html` (standalone styled document)

**PWA**
- Installable on desktop and mobile ("Add to Home Screen" / browser install prompt)
- Service worker caches static assets (cache-first) and pages (network-first with offline fallback)
- Themed title bar (`#0f172a`) on supported platforms
- Auto-generated icons at 32 px (favicon), 180 px (Apple touch), 192 px and 512 px (manifest)

**Persistence & UX**
- Auto-saves to `localStorage` (500 ms debounce), restores on reload
- Responsive: 50/50 split on desktop, toggle mode on mobile
- Dark developer-tool aesthetic throughout

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Markdown | `react-markdown` · `remark-gfm` |
| Highlighting | `rehype-highlight` (highlight.js) |
| Sanitization | `rehype-sanitize` |
| Diagrams | `mermaid` |
| Toasts | `react-hot-toast` |
| Icons / PWA | `next/og` (`ImageResponse`) |

## Project Structure

```
/app
  layout.jsx               # Root layout, metadata, viewport, PWA registration
  page.jsx                 # Entry point
  manifest.js              # Web App Manifest (/manifest.webmanifest)
  icon.jsx                 # 32×32 favicon (edge, auto-detected by Next.js)
  apple-icon.jsx           # 180×180 Apple touch icon (edge)
  globals.css              # Tailwind imports, highlight.js theme, scrollbars
  /api/pwa-icon/route.js   # Dynamic PNG icon at any size (?size=192|512)

/components
  Layout.jsx               # Split-pane shell, state owner, autosave, mobile toggle
  EditorPane.jsx           # Monaco Editor wrapper, keyboard shortcuts
  PreviewPane.jsx          # react-markdown renderer, click-to-line handler
  Toolbar.jsx              # Formatting buttons, import/export controls
  MermaidDiagram.jsx       # Per-block Mermaid renderer (lazy)
  PwaRegistration.jsx      # Registers /sw.js after hydration

/lib
  markdownParser.js        # Remark plugin — injects data-line attributes
  lineMapper.js            # DOM click → line number, Monaco highlight flash
  storage.js               # localStorage read / write / clear
  fileUtils.js             # Blob export (.md, .html), FileReader import
  defaultContent.js        # Demo document shown on first load

/public
  sw.js                    # Service worker (cache-first assets, network-first pages)
```

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm start
```

## Deployment

Zero-config on Vercel. Push to GitHub, then import at [vercel.com/new](https://vercel.com/new). No environment variables required. HTTPS is provided automatically, which satisfies the service worker security requirement.

After deployment, visit the live URL in Chrome or Edge — the install icon appears in the address bar to add MarkView as a standalone desktop app.
