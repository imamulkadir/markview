'use client';

import { useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';

export default function EditorPane({ content, onChange, editorRef, monacoRef }) {
  const internalEditorRef = useRef(null);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    internalEditorRef.current = editor;
    if (editorRef) editorRef.current = editor;
    if (monacoRef) monacoRef.current = monaco;

    // Configure editor
    editor.updateOptions({
      wordWrap: 'on',
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace",
      fontLigatures: true,
      lineHeight: 22,
      padding: { top: 16, bottom: 16 },
      renderLineHighlight: 'line',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: false, indentation: true },
      scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
      },
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
    });

    // Register markdown keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      wrapSelection(editor, '**', '**');
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      wrapSelection(editor, '*', '*');
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      const sel = editor.getSelection();
      const selectedText = editor.getModel().getValueInRange(sel);
      if (selectedText) {
        editor.executeEdits('', [{
          range: sel,
          text: `[${selectedText}](url)`,
        }]);
      }
    });
  }, [editorRef, monacoRef]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/80 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Markdown
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="hidden sm:block">Ctrl+B Bold</span>
          <span className="hidden sm:block">·</span>
          <span className="hidden sm:block">Ctrl+I Italic</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={content}
          onChange={(val) => onChange(val ?? '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            automaticLayout: true,
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-slate-900 text-slate-500 text-sm">
              Loading editor…
            </div>
          }
        />
      </div>
    </div>
  );
}

function wrapSelection(editor, before, after) {
  const sel = editor.getSelection();
  const model = editor.getModel();
  const selected = model.getValueInRange(sel);
  if (selected) {
    editor.executeEdits('', [{
      range: sel,
      text: `${before}${selected}${after}`,
    }]);
  } else {
    const pos = editor.getPosition();
    editor.executeEdits('', [{
      range: { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: pos.lineNumber, endColumn: pos.column },
      text: `${before}text${after}`,
    }]);
  }
}
