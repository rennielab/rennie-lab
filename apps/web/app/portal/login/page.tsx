'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { firm } from '@/lib/mock';

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.mitchell@example.com');
  const [password, setPassword] = useState('demopass');

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center">
            <span className="text-accent font-bold">C</span>
          </div>
          <div>
            <div className="text-xs text-fg-muted">Client Portal</div>
            <div className="font-bold">{firm.name}</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mt-8 mb-1">Sign in to view your matters</h1>
        <p className="text-sm text-fg-muted mb-6">
          We&apos;ve sent a magic link to your email. Or enter your password below.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push('/portal/invoices');
          }}
          className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent-dim transition">
            Sign in
          </button>
        </form>

        <p className="text-xs text-fg-subtle text-center mt-6">
          <Link href="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
