'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import Toolbar from './Toolbar';
import PreviewPane from './PreviewPane';
import { saveContent, loadContent } from '../lib/storage';
import DEFAULT_MARKDOWN from '../lib/defaultContent';

// Dynamically import Monaco to avoid SSR issues
const EditorPane = dynamic(() => import('./EditorPane'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-900 text-slate-500 text-sm">
      Loading editor…
    </div>
  ),
});

export default function Layout() {
  // Always start with DEFAULT_MARKDOWN so server and client render identically.
  // After hydration the effect below patches in whatever is stored in localStorage.
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [hydrated, setHydrated] = useState(false);
  const [importedFile, setImportedFile] = useState(null); // { handle, name }

  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const previewRef = useRef(null);

  // Load persisted content once — runs only on the client after hydration
  useEffect(() => {
    const saved = loadContent();
    if (saved) setContent(saved);
    setHydrated(true);
  }, []);

  // Autosave — skip the first render so we don't clobber storage before loading
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => saveContent(content), 500);
    return () => clearTimeout(timer);
  }, [content, hydrated]);

  const handleReset = useCallback(() => {
    setContent(DEFAULT_MARKDOWN);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            fontSize: '13px',
          },
        }}
      />

      {/* Toolbar */}
      <Toolbar
        editorRef={editorRef}
        monacoRef={monacoRef}
        content={content}
        onChange={setContent}
        onReset={handleReset}
        previewRef={previewRef}
        importedFile={importedFile}
        setImportedFile={setImportedFile}
      />

      {/* Mobile toggle */}
      <div className="flex border-b border-slate-700 md:hidden">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobileView === 'editor'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          onClick={() => setMobileView('editor')}
        >
          Editor
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobileView === 'preview'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          onClick={() => setMobileView('preview')}
        >
          Preview
        </button>
      </div>

      {/* Main split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor — hidden on mobile when preview is active */}
        <div
          className={`flex flex-col border-r border-slate-700/60 ${
            mobileView === 'editor' ? 'flex w-full md:w-1/2' : 'hidden md:flex md:w-1/2'
          }`}
        >
          <EditorPane
            content={content}
            onChange={setContent}
            editorRef={editorRef}
            monacoRef={monacoRef}
          />
        </div>

        {/* Preview — hidden on mobile when editor is active */}
        <div
          className={`flex flex-col ${
            mobileView === 'preview' ? 'flex w-full md:w-1/2' : 'hidden md:flex md:w-1/2'
          }`}
        >
          <PreviewPane
            content={content}
            editorRef={editorRef}
            monacoRef={monacoRef}
            previewRef={previewRef}
            importedFile={importedFile}
          />
        </div>
      </div>
    </div>
  );
}
