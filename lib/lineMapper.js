/**
 * Given a click event on the preview pane, walks up the DOM tree
 * to find the nearest ancestor (or self) that has a data-line attribute.
 * Returns the line number as an integer, or null if not found.
 */
export function getLineFromClick(event) {
  let el = event.target;
  while (el && el !== event.currentTarget) {
    const line = el.getAttribute && el.getAttribute('data-line');
    if (line) return parseInt(line, 10);
    el = el.parentElement;
  }
  return null;
}

/**
 * Highlights a line in Monaco editor briefly using a decoration,
 * then removes it after a short duration.
 */
export function highlightLine(editor, monaco, lineNumber) {
  if (!editor || !monaco || !lineNumber) return;

  const decorations = editor.deltaDecorations([], [
    {
      range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      options: {
        isWholeLine: true,
        className: 'monaco-line-highlight',
        overviewRuler: {
          color: '#3b82f6',
          position: monaco.editor.OverviewRulerLane.Full,
        },
      },
    },
  ]);

  setTimeout(() => {
    editor.deltaDecorations(decorations, []);
  }, 800);
}
