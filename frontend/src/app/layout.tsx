import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { defaultLocale } from '@/i18n/config';
import type { Viewport } from 'next';

const geistSans = Geist({ 
  variable: '--font-geist-sans', 
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true,
});
const geistMono = Geist_Mono({ 
  variable: '--font-geist-mono', 
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true,
});

// Viewport configuration for better mobile/Telegram support
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // Important for in-app browsers like Telegram
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

