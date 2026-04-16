import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const size = Math.min(512, Math.max(16, parseInt(searchParams.get('size') || '192', 10)));

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: Math.round(size * 0.2),
          border: `${Math.max(1, Math.round(size * 0.025))}px solid #334155`,
          boxShadow: `0 0 ${size * 0.12}px #38bdf833`,
        }}
      >
        <span
          style={{
            color: '#38bdf8',
            fontSize: Math.round(size * 0.56),
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          M
        </span>
      </div>
    ),
    { width: size, height: size },
  );
}
