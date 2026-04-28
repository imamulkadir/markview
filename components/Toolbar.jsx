'use client';

import { useRef, useState } from 'react';
import { importMarkdownFile, openMarkdownFilePicker, saveToFileHandle, exportMarkdown, exportHTML } from '../lib/fileUtils';
import { clearContent } from '../lib/storage';
import toast from 'react-hot-toast';

const TOOLBAR_ACTIONS = [
  {
    group: 'headings',
    items: [
      { label: 'H1', title: 'Heading 1', insert: (s) => s ? `# ${s}` : '# Heading 1' },
      { label: 'H2', title: 'Heading 2', insert: (s) => s ? `## ${s}` : '## Heading 2' },
      { label: 'H3', title: 'Heading 3', insert: (s) => s ? `### ${s}` : '### Heading 3' },
    ],
  },
  {
    group: 'inline',
    items: [
      { label: 'B', title: 'Bold (Ctrl+B)', insert: (s) => s ? `**${s}**` : '**bold**', className: 'font-bold' },
      { label: 'I', title: 'Italic (Ctrl+I)', insert: (s) => s ? `*${s}*` : '*italic*', className: 'italic' },
      { label: 'S', title: 'Strikethrough', insert: (s) => s ? `~~${s}~~` : '~~strikethrough~~', className: 'line-through' },
      { label: '`', title: 'Inline code', insert: (s) => s ? `\`${s}\`` : '`code`' },
    ],
  },
  {
    group: 'blocks',
    items: [
      { label: '```', title: 'Code block', insert: () => '```javascript\n// code here\n```' },
      { label: '>', title: 'Blockquote', insert: (s) => s ? `> ${s}` : '> blockquote' },
      { label: '---', title: 'Horizontal rule', insert: () => '\n---\n' },
    ],
  },
  {
    group: 'lists',
    items: [
      { label: 'UL', title: 'Bullet list', insert: () => '- Item 1\n- Item 2\n- Item 3' },
      { label: 'OL', title: 'Numbered list', insert: () => '1. Item 1\n2. Item 2\n3. Item 3' },
      { label: '☑', title: 'Task list', insert: () => '- [ ] Task 1\n- [x] Task 2\n- [ ] Task 3' },
    ],
  },
  {
    group: 'media',
    items: [
      { label: '🔗', title: 'Link (Ctrl+K)', insert: (s) => s ? `[${s}](url)` : '[link text](url)' },
      { label: '🖼', title: 'Image', insert: () => '![alt text](image-url)' },
      { label: '⊞', title: 'Table', insert: () => '| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |' },
    ],
  },
];

export default function Toolbar({ editorRef, monacoRef, content, onChange, onReset, previewRef }) {
  const fileInputRef = useRef(null);
  const [importedFile, setImportedFile] = useState(null); // { handle, name }
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  function insertMarkdown(insertFn) {
    const editor = editorRef?.current;
    if (!editor) return;

    const sel = editor.getSelection();
    const model = editor.getModel();
    const selectedText = model.getValueInRange(sel);
    const newText = insertFn(selectedText);

    editor.executeEdits('toolbar', [{ range: sel, text: newText }]);
    editor.focus();
  }

  // Fallback handler for browsers without File System Access API
  async function handleImport(e) {
    try {
      const text = await importMarkdownFile(e);
      onChange(text);
      setImportedFile(null);
      toast.success('File imported');
    } catch (err) {
      toast.error(err.message || 'Import failed');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleImportClick() {
    if ('showOpenFilePicker' in window) {
      openMarkdownFilePicker()
        .then(({ text, fileHandle }) => {
          onChange(text);
          setImportedFile({ handle: fileHandle, name: fileHandle.name });
          toast.success(`Imported ${fileHandle.name}`);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          toast.error(err.message || 'Import failed');
        });
    } else {
      fileInputRef.current?.click();
    }
  }

  async function handleSave() {
    if (!importedFile || saveState === 'saving') return;
    setSaveState('saving');
    try {
      await saveToFileHandle(importedFile.handle, content);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      setSaveState('idle');
      toast.error(err.message || 'Save failed');
    }
  }

  function handleExportMd() {
    exportMarkdown(content);
    toast.success('Markdown exported');
  }

  function handleExportHtml() {
    const el = previewRef?.current?.current;
    if (!el) { toast.error('Preview not ready'); return; }
    exportHTML(el);
    toast.success('HTML exported');
  }

  function handleReset() {
    onReset();
    clearContent();
    setImportedFile(null);
    toast.success('Reset to default content');
  }

  return (
    <header className="flex flex-wrap items-center gap-1 border-b border-slate-700 bg-slate-900 px-3 py-2">
      {TOOLBAR_ACTIONS.map((group) => (
        <div key={group.group} className="flex items-center gap-0.5">
          {group.items.map((action) => (
            <button
              key={action.label}
              title={action.title}
              onClick={() => insertMarkdown(action.insert)}
              className={`min-w-[2rem] rounded px-2 py-1 text-xs font-mono text-slate-300 transition-colors hover:bg-slate-700 hover:text-white active:bg-slate-600 ${action.className ?? ''}`}
            >
              {action.label}
            </button>
          ))}
          <div className="mx-1 h-5 w-px bg-slate-700" />
        </div>
      ))}

      {/* File operations */}
      <div className="ml-auto flex items-center gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown"
          className="hidden"
          onChange={handleImport}
        />
        <button
          title="Import .md file"
          onClick={handleImportClick}
          className="rounded px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          Import
        </button>
        <button
          title={importedFile ? `Save to ${importedFile.name}` : 'Import a file first'}
          onClick={handleSave}
          disabled={!importedFile || saveState === 'saving'}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40
            ${saveState === 'saved'
              ? 'text-emerald-300'
              : 'text-emerald-400 hover:bg-emerald-900/30 hover:text-emerald-300'}
            disabled:hover:bg-transparent disabled:hover:text-emerald-400`}
        >
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : 'Save'}
        </button>
        <button
          title="Export as .md"
          onClick={handleExportMd}
          className="rounded px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          .md
        </button>
        <button
          title="Export as HTML"
          onClick={handleExportHtml}
          className="rounded px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          .html
        </button>
        <div className="mx-1 h-5 w-px bg-slate-700" />
        <button
          title="Reset to default content"
          onClick={handleReset}
          className="rounded px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
        >
          Reset
        </button>
      </div>
    </header>
  );
}
