export default function manifest() {
  return {
    name: 'MarkView — Markdown Editor',
    short_name: 'MarkView',
    description: 'Markdown editor with live preview, click-to-line sync, Mermaid diagrams, and import/export.',
    start_url: '/',
    display: 'standalone',
    orientation: 'landscape',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/api/pwa-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
