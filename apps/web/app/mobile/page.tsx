'use client';

// Bridge page — gives messaging apps an https:// link they will actually
// linkify, then deep-links the user into Expo Go via the exp:// scheme.
// iOS prompts "Open in Expo Go?" → tap Open → Clockd loads.

import { useEffect, useState } from 'react';

const EXPO_URL =
  'exp://u.expo.dev/9611b8de-aebf-4411-b78a-b26cff67656f?channel-name=preview';

export default function MobileBridge() {
  const [tried, setTried] = useState(false);

  useEffect(() => {
    // Fire the deep link once on mount.
    setTried(true);
    window.location.href = EXPO_URL;
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
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: '#0E2A1E',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22C55E',
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          fontSize: 26,
          marginBottom: 24,
        }}>
        BH
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
        Opening Clockd…
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 15,
          marginTop: 12,
          maxWidth: 360,
          lineHeight: 1.55,
        }}>
        If your phone asks <strong>“Open in Expo Go?”</strong> — tap{' '}
        <strong>Open</strong>.
      </p>

      <a
        href={EXPO_URL}
        style={{
          marginTop: 32,
          background: '#22C55E',
          color: '#0E2A1E',
          fontWeight: 700,
          fontSize: 16,
          padding: '14px 24px',
          borderRadius: 14,
          textDecoration: 'none',
        }}>
        Open in Expo Go
      </a>

      <div
        style={{
          marginTop: 48,
          maxWidth: 360,
          textAlign: 'left',
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
        }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
          First time?
        </p>
        <ol style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>
            Install <strong>Expo Go</strong> from the App Store
          </li>
          <li>Come back to this page and tap the green button above</li>
          <li>iOS will prompt — tap <strong>Open</strong></li>
        </ol>
      </div>

      {tried && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 32 }}>
          Nothing happened? Force-quit Expo Go and try again.
        </p>
      )}
    </main>
  );
}
