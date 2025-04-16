'use client';

import { AuthProvider } from '@neothink/auth';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider platformSlug="ascenders">
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 