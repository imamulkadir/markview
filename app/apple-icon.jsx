import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(145deg, #0f172a, #1e293b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
        }}
      >
        <span
          style={{
            color: '#38bdf8',
            fontSize: 104,
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
