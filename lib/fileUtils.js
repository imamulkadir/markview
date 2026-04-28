/**
 * Triggers a file download in the browser.
 * @param {string} content - File content
 * @param {string} filename - Filename with extension
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export editor content as a .md file.
 */
export function exportMarkdown(content) {
  downloadFile(content, 'document.md', 'text/markdown');
}

const HTML_EXPORT_CSS = `
*, *::before, *::after { box-sizing: border-box; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 860px; margin: 40px auto; padding: 0 28px;
  line-height: 1.7; font-size: 15px;
  color: #e2e8f0; background: #0f172a;
}
h1,h2,h3,h4,h5,h6 { margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; color: #f1f5f9; }
h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 2px solid #334155; }
h2 { font-size: 1.5em; padding-bottom: 0.2em; border-bottom: 1px solid #1e293b; }
h3 { font-size: 1.25em; }
h4 { font-size: 1.1em; }
h5, h6 { font-size: 1em; }
p { margin: 0.8em 0; }
strong { font-weight: 700; }
em { font-style: italic; }
del { text-decoration: line-through; color: #94a3b8; }
a { color: #60a5fa; text-decoration: underline; }
code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background: #1e293b; border: 1px solid #334155; color: #7dd3fc;
  padding: 2px 6px; border-radius: 4px; font-size: 0.875em;
}
pre {
  background: #1e293b; border: 1px solid #334155;
  padding: 1em 1.2em; border-radius: 8px; overflow-x: auto; margin: 1em 0;
}
pre code { background: none !important; border: none !important; padding: 0; color: inherit; font-size: 0.875em; }
blockquote {
  border-left: 4px solid #3b82f6; margin: 1em 0;
  padding: 0.5em 0 0.5em 1em; border-radius: 0 4px 4px 0;
  background: #1e293b; color: #94a3b8;
}
blockquote p { margin: 0; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.9em; }
th { background: #1e293b; color: #e2e8f0; font-weight: 600; border: 1px solid #334155; padding: 8px 12px; }
td { color: #cbd5e1; border: 1px solid #334155; padding: 8px 12px; }
tr:nth-child(even) td { background: #0f172a; }
ul, ol { padding-left: 1.5em; margin: 0.8em 0; }
li { margin: 0.3em 0; }
img { max-width: 100%; height: auto; border-radius: 4px; border: 1px solid #334155; }
hr { border: none; border-top: 1px solid #334155; margin: 2em 0; }
input[type="checkbox"] { margin-right: 0.4em; }
@page { margin: 1in; size: A4; }
@media print {
  body { color: #1a202c !important; background: #ffffff !important; padding: 0; }
  h1,h2,h3,h4,h5,h6 { color: #0f172a !important; }
  h1 { border-bottom-color: #cbd5e1 !important; }
  h2 { border-bottom-color: #e2e8f0 !important; }
  a { color: #2563eb !important; }
  code { background: #f1f5f9 !important; border-color: #e2e8f0 !important; color: #1a202c !important; }
  pre { background: #f8fafc !important; border-color: #e2e8f0 !important; page-break-inside: avoid; white-space: pre-wrap; }
  pre code { color: inherit !important; }
  blockquote { background: #f8fafc !important; color: #475569 !important; }
  th { background: #f1f5f9 !important; color: #1a202c !important; border-color: #cbd5e1 !important; }
  td { color: #1a202c !important; border-color: #cbd5e1 !important; }
  tr:nth-child(even) td { background: #ffffff !important; }
  img { border-color: #e2e8f0 !important; page-break-inside: avoid; }
  hr { border-top-color: #e2e8f0 !important; }
  h1,h2,h3,h4,h5,h6 { page-break-after: avoid; }
  pre { page-break-inside: avoid; }
  table { page-break-inside: avoid; }
}
`;

const PDF_CSS = `
*, *::before, *::after { box-sizing: border-box; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
html { background: #0f172a !important; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 860px; margin: 0 auto; padding: 0.5in 0.75in;
  line-height: 1.7; font-size: 15px;
  color: #e2e8f0 !important; background: #0f172a !important;
  min-height: 100vh;
}
h1,h2,h3,h4,h5,h6 { padding-top: 1.5em; margin-top: 0; margin-bottom: 0.5em; line-height: 1.3; color: #f1f5f9 !important; }
h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 2px solid #334155 !important; }
h2 { font-size: 1.5em; padding-bottom: 0.2em; border-bottom: 1px solid #1e293b !important; }
h3 { font-size: 1.25em; }
h4 { font-size: 1.1em; }
h5, h6 { font-size: 1em; }
p { padding-top: 0.8em; margin: 0; }
blockquote p, li > p { padding-top: 0; }
strong { font-weight: 700; }
em { font-style: italic; }
del { text-decoration: line-through; color: #94a3b8 !important; }
a { color: #60a5fa !important; text-decoration: underline; }
code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background: #1e293b !important; border: 1px solid #334155 !important; color: #7dd3fc !important;
  padding: 2px 6px; border-radius: 4px; font-size: 0.875em;
}
pre {
  background: #1e293b !important; border: 1px solid #334155 !important;
  padding: 1em 1.2em; border-radius: 8px; overflow-x: auto; margin: 0 0 1em;
}
pre code { background: none !important; border: none !important; padding: 0; color: inherit !important; font-size: 0.875em; }
blockquote {
  border-left: 4px solid #3b82f6 !important; margin: 0 0 1em;
  padding: 0.5em 0 0.5em 1em; border-radius: 0 4px 4px 0;
  background: #1e293b !important; color: #94a3b8 !important;
}
blockquote p { padding-top: 0; margin: 0; }
table { border-collapse: collapse; width: 100%; margin: 0 0 1em; font-size: 0.9em; }
th { background: #1e293b !important; color: #e2e8f0 !important; font-weight: 600; border: 1px solid #334155 !important; padding: 8px 12px; }
td { color: #cbd5e1 !important; border: 1px solid #334155 !important; padding: 8px 12px; }
tr:nth-child(even) td { background: #0f172a !important; }
ul, ol { padding-left: 1.5em; padding-top: 0.8em; margin: 0 0 0.8em; }
li { margin: 0.3em 0; }
li ul, li ol { padding-top: 0.2em; margin-bottom: 0; }
img { max-width: 100%; height: auto; border-radius: 4px; border: 1px solid #334155 !important; }
hr { border: none; border-top: 1px solid #334155 !important; padding-top: 2em; margin: 0 0 2em; }
input[type="checkbox"] { margin-right: 0.4em; }
@page { margin: 0.5in 0; size: A4; background: #0f172a; }
@media print {
  html, body { background: #0f172a !important; }
  h1,h2,h3,h4,h5,h6 { page-break-after: avoid; }
  pre { page-break-inside: avoid; white-space: pre-wrap; }
  table { page-break-inside: avoid; }
  img { page-break-inside: avoid; }
}
`;

/**
 * Export rendered HTML (from the preview pane DOM node).
 * Opens correctly in any browser and prints cleanly as PDF via Ctrl+P.
 * @param {HTMLElement} previewElement
 */
export function exportHTML(previewElement) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported Document</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css" />
  <style>${HTML_EXPORT_CSS}</style>
</head>
<body>
${previewElement.innerHTML}
</body>
</html>`;
  downloadFile(html, 'document.html', 'text/html');
}

/**
 * Opens a print-ready window with light theme and triggers the browser print dialog.
 * Uses a Blob URL so styles are fully applied before the print dialog fires.
 * @param {HTMLElement} previewElement
 */
export function exportPDF(previewElement) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css" />
  <style>${PDF_CSS}</style>
</head>
<body>
${previewElement.innerHTML}
<script>
  window.addEventListener('load', function () {
    window.focus();
    setTimeout(function () { window.print(); }, 400);
  });
<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, '_blank');
  if (!opened) {
    URL.revokeObjectURL(url);
    alert('Please allow pop-ups for this site to export PDF.');
    return;
  }
  // Revoke after enough time for the window to load
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}


/**
 * Reads a .md file from an input event and returns its text content.
 * @param {Event} event - File input change event
 * @returns {Promise<string>}
 */
export function importMarkdownFile(event) {
  return new Promise((resolve, reject) => {
    const file = event.target.files?.[0];
    if (!file) return reject(new Error('No file selected'));
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown') && file.type !== 'text/markdown') {
      return reject(new Error('Please select a .md or .markdown file'));
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Opens a file picker and returns the text content + a FileSystemFileHandle
 * for saving back to the same file later.
 * @returns {Promise<{ text: string, fileHandle: FileSystemFileHandle }>}
 */
export async function openMarkdownFilePicker() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown'] } }],
    multiple: false,
  });
  const file = await fileHandle.getFile();
  const text = await file.text();
  return { text, fileHandle };
}

/**
 * Writes content back to a previously opened file via its handle.
 * @param {FileSystemFileHandle} fileHandle
 * @param {string} content
 */
export async function saveToFileHandle(fileHandle, content) {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}
