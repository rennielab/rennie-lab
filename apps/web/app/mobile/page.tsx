'use client';

// Bridge → redirect to the standalone mobile web build at clockd-mobile.vercel.app.
// Kept for backwards compatibility with links already in the wild.

import { useEffect } from 'react';

const MOBILE_URL = 'https://clockd-mobile.vercel.app';

export default function MobileBridge() {
  useEffect(() => {
    window.location.replace(MOBILE_URL);
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0E2A1E',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        textAlign: 'center',
      }}>
      <p style={{ color: 'rgba(255,255,255,0.7)' }}>
        Opening Clockd mobile…
      </p>
      <a
        href={MOBILE_URL}
        style={{
          marginTop: 16,
          color: '#22C55E',
          fontWeight: 700,
        }}>
        Tap here if you aren&apos;t redirected
      </a>
    </main>
  );
}
