import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clockd — Time tracking for lawyers',
  description: 'Automatic, AI-captured billable time for law firms.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
