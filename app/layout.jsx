import './globals.css';
import PwaRegistration from '../components/PwaRegistration';

export const metadata = {
  title: 'MarkView — Markdown Editor + Live Preview',
  description:
    'Markdown editor with live preview, click-to-line sync, Mermaid diagrams, and import/export.',
  applicationName: 'MarkView',
};

// Separate viewport export — required by Next.js 14+ for themeColor
export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
