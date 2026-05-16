// Custom root HTML for the web export. Adds the iOS PWA meta tags so when a
// user does Share → Add to Home Screen, the app launches **fullscreen** with
// no Safari URL bar — feels like a native app. Forest-green status bar to
// match the firm theme.

import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>Clockd</title>

        {/* iOS standalone PWA — launches fullscreen from home screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Clockd" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0E2A1E" />

        {/* Android Chrome */}
        <meta name="application-name" content="Clockd" />

        {/* Home-screen icon (re-uses the existing app icon) */}
        <link rel="apple-touch-icon" href="/assets/assets/images/icon.png" />
        <link rel="icon" type="image/png" href="/assets/assets/images/favicon.png" />

        <ScrollViewStyleReset />

        {/* Light a deeper green so the safe-area inset doesn't look jarring */}
        <style dangerouslySetInnerHTML={{ __html: bodyStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const bodyStyles = `
  html, body { background-color: #0E2A1E; }
  body {
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }
`;
