'use client';
import { AuthProvider } from '@neothink/auth';
import './globals.css';
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body>
        <AuthProvider platformSlug="ascenders">
          {children}
        </AuthProvider>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map