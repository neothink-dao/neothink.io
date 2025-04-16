import React from 'react';
import './globals.css';
import { Sidebar } from './sidebar';

export const metadata = {
  title: 'Avolve Admin Dashboard',
  description: 'Live analytics, user engagement, and token management for Avolve',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-zinc-900 via-slate-900 to-gray-950 min-h-screen">
        <Sidebar />
        <main className="ml-64 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
