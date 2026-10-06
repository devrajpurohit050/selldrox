import type { Metadata } from 'next';

import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { seoKeywords } from '@/config/seo-keywords';
import { siteConfig } from '@/config/site';
import { getCurrencyPreference, shouldDetectCurrencyInBrowser } from '@/lib/currency';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: seoKeywords,
  authors: [{ name: 'Dev Rajpurohit' }],
  creator: 'Dev Rajpurohit',
  publisher: siteConfig.name,
  category: 'Digital Products',
  alternates: {
    canonical: '/',
  },
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
    images: [
      {
        url: '/asstes/selldrox%20logo.png',
        width: 512,
        height: 512,
        alt: 'SELLDROX logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/asstes/selldrox%20logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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
          <ScrollToTopButton />
        </div>
      </body>
    </html>
  );
}
