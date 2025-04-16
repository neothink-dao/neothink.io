import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Neothinkers - Unlock Your Full Potential',
    description: 'Join the Neothink movement and transform your thinking to achieve extraordinary results.',
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map