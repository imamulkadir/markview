import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(145deg, #0f172a, #1e293b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            color: '#38bdf8',
            fontSize: 20,
            fontWeight: 800,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          M
        </span>
      </div>
    ),
    { ...size },
  );
}
