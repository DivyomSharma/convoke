import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Convoke - For people building the future';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Satori requires .ttf or .otf, not .woff
  const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf';
  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          position: 'relative',
        }}
      >
        {/* Background glow effects to mimic the home page */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(198, 163, 107, 0.15), transparent 60%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: 140,
              fontFamily: '"Instrument Serif"',
              color: '#eaeaea',
              margin: 0,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            Convoke.
          </h1>
          <p
            style={{
              fontSize: 42,
              color: '#8a8a8a',
              marginTop: 20,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            For people building the future.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Instrument Serif',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
