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

/**
 * Export rendered HTML (from the preview pane DOM node).
 * @param {HTMLElement} previewElement - The rendered preview container
 */
export function exportHTML(previewElement) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #e2e8f0; background: #0f172a; }
    h1,h2,h3,h4,h5,h6 { margin-top: 1.5em; color: #f1f5f9; }
    pre { background: #1e293b; padding: 1em; border-radius: 6px; overflow-x: auto; }
    code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #334155; padding: 8px 12px; }
    th { background: #1e293b; }
    blockquote { border-left: 4px solid #3b82f6; margin: 0; padding-left: 1em; color: #94a3b8; }
    a { color: #60a5fa; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${previewElement.innerHTML}
</body>
</html>`;
  downloadFile(htmlContent, 'document.html', 'text/html');
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
