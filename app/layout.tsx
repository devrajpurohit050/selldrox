import type { Metadata } from 'next';

import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/config/site';
import { getCurrencyPreference, shouldDetectCurrencyInBrowser } from '@/lib/currency';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: ['digital products', 'templates', 'source code', 'creative assets', 'business resources'],
  icons: {
    icon: '/asstes/selldrox%20logo.png',
    shortcut: '/asstes/selldrox%20logo.png',
    apple: '/asstes/selldrox%20logo.png',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialCurrency = getCurrencyPreference();
  const detectCurrencyInBrowser = shouldDetectCurrencyInBrowser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <div className="theme-shell min-h-screen">
          <Navbar initialCurrency={initialCurrency} detectCurrencyInBrowser={detectCurrencyInBrowser} />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
