'use client';

import { useRef, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { remarkLineNumbers } from '../lib/markdownParser';
import { getLineFromClick, highlightLine } from '../lib/lineMapper';
import MermaidDiagram from './MermaidDiagram';

// Extend sanitize schema to allow data-line and class attributes
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'dataLine', 'className'],
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
  },
};

export default function PreviewPane({ content, editorRef, monacoRef, previewRef }) {
  const containerRef = useRef(null);

  // Expose preview container to parent for HTML export
  if (previewRef) previewRef.current = containerRef;

  const handleClick = useCallback((e) => {
    const line = getLineFromClick(e);
    if (!line || !editorRef?.current || !monacoRef?.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    editor.revealLineInCenter(line);
    editor.setPosition({ lineNumber: line, column: 1 });
    editor.focus();
    highlightLine(editor, monaco, line);
  }, [editorRef, monacoRef]);

  const remarkPlugins = useMemo(() => [remarkGfm, remarkLineNumbers], []);
  const rehypePlugins = useMemo(() => [
    rehypeHighlight,
    [rehypeSanitize, sanitizeSchema],
  ], []);

  const components = useMemo(() => ({
    // Render mermaid code blocks with MermaidDiagram component
    // eslint-disable-next-line no-unused-vars
    code({ node, inline, className, children, ...props }) {
      const lang = /language-(\w+)/.exec(className || '')?.[1];
      // inline is deprecated in react-markdown v9 — detect by absence of lang
      const isBlock = !inline && (lang !== undefined || String(children).includes('\n'));
      if (isBlock && lang === 'mermaid') {
        return <MermaidDiagram code={String(children).trim()} />;
      }
      if (!isBlock) {
        return (
          <code className="rounded bg-slate-700/60 px-1.5 py-0.5 font-mono text-[0.875em] text-sky-300">
            {children}
          </code>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // External links open in new tab
    // eslint-disable-next-line no-unused-vars
    a({ node, href, children, ...props }) {
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
          {...props}
        >
          {children}
        </a>
      );
    },
    // Styled table — wrap in scrollable div but keep data-line on the <table>
    // eslint-disable-next-line no-unused-vars
    table({ node, children, ...props }) {
      return (
        <div className="my-4 overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full border-collapse text-sm" {...props}>
            {children}
          </table>
        </div>
      );
    },
    // eslint-disable-next-line no-unused-vars
    th({ node, children, ...props }) {
      return (
        <th className="border-b border-slate-700 bg-slate-800 px-4 py-2 text-left font-semibold text-slate-200" {...props}>
          {children}
        </th>
      );
    },
    // eslint-disable-next-line no-unused-vars
    td({ node, children, ...props }) {
      return (
        <td className="border-b border-slate-800 px-4 py-2 text-slate-300" {...props}>
          {children}
        </td>
      );
    },
    // eslint-disable-next-line no-unused-vars
    blockquote({ node, children, ...props }) {
      return (
        <blockquote className="my-4 border-l-4 border-blue-500 bg-slate-800/50 py-2 pl-4 pr-2 text-slate-400 italic" {...props}>
          {children}
        </blockquote>
      );
    },
    // eslint-disable-next-line no-unused-vars
    h1({ node, children, ...props }) {
      return <h1 className="mb-4 mt-8 border-b border-slate-700 pb-2 text-3xl font-bold text-slate-100" {...props}>{children}</h1>;
    },
    // eslint-disable-next-line no-unused-vars
    h2({ node, children, ...props }) {
      return <h2 className="mb-3 mt-6 border-b border-slate-700/60 pb-1 text-2xl font-semibold text-slate-100" {...props}>{children}</h2>;
    },
    // eslint-disable-next-line no-unused-vars
    h3({ node, children, ...props }) {
      return <h3 className="mb-2 mt-5 text-xl font-semibold text-slate-200" {...props}>{children}</h3>;
    },
    // eslint-disable-next-line no-unused-vars
    h4({ node, children, ...props }) {
      return <h4 className="mb-2 mt-4 text-lg font-semibold text-slate-200" {...props}>{children}</h4>;
    },
    // eslint-disable-next-line no-unused-vars
    h5({ node, children, ...props }) {
      return <h5 className="mb-1 mt-3 text-base font-semibold text-slate-300" {...props}>{children}</h5>;
    },
    // eslint-disable-next-line no-unused-vars
    h6({ node, children, ...props }) {
      return <h6 className="mb-1 mt-3 text-sm font-semibold text-slate-400 uppercase tracking-wide" {...props}>{children}</h6>;
    },
    // eslint-disable-next-line no-unused-vars
    pre({ node, children, ...props }) {
      return (
        <pre className="my-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/80 p-4 text-sm leading-relaxed" {...props}>
          {children}
        </pre>
      );
    },
    hr() {
      return <hr className="my-6 border-slate-700" />;
    },
    // eslint-disable-next-line no-unused-vars
    img({ node, src, alt, ...props }) {
      return (
        <img
          src={src}
          alt={alt || ''}
          className="my-4 max-w-full rounded-lg border border-slate-700"
          {...props}
        />
      );
    },
    // eslint-disable-next-line no-unused-vars
    ul({ node, children, ...props }) {
      return <ul className="my-2 ml-6 list-disc space-y-1 text-slate-300" {...props}>{children}</ul>;
    },
    // eslint-disable-next-line no-unused-vars
    ol({ node, children, ...props }) {
      return <ol className="my-2 ml-6 list-decimal space-y-1 text-slate-300" {...props}>{children}</ol>;
    },
    // eslint-disable-next-line no-unused-vars
    li({ node, children, ...props }) {
      return <li className="text-slate-300 leading-relaxed" {...props}>{children}</li>;
    },
    // eslint-disable-next-line no-unused-vars
    p({ node, children, ...props }) {
      return <p className="my-3 leading-relaxed text-slate-300" {...props}>{children}</p>;
    },
  }), []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/80 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Preview
        </span>
        <span className="text-xs text-slate-500">Click any element to jump to source</span>
      </div>
      <div
        ref={containerRef}
        className="preview-content flex-1 cursor-pointer overflow-y-auto px-6 py-4"
        onClick={handleClick}
      >
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
