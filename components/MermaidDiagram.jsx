'use client';

import { useEffect, useRef, useState, useId } from 'react';

let mermaidInstance = null;

async function getMermaid() {
  if (mermaidInstance) return mermaidInstance;
  const mod = await import('mermaid');
  mermaidInstance = mod.default;
  mermaidInstance.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  });
  return mermaidInstance;
}

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  // useId() generates a stable ID that matches between server and client,
  // unlike a module-level counter which resets on the client but persists
  // across requests on the server.
  const reactId = useId();
  const diagramId = `mermaid-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = await getMermaid();
        const { svg: rendered } = await mermaid.render(diagramId, code);
        if (!cancelled) {
          setSvg(rendered);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Mermaid render error');
          setSvg('');
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [code]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-500/30 bg-red-950/30 p-4 text-red-400 text-sm font-mono">
        <span className="font-bold">Mermaid error:</span> {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-slate-500 text-sm">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/50 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
