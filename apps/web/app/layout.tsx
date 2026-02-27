import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from './components/Navbar';
import { GlassFooter } from './components/GlassFooter';
import { CookieConsentBanner } from './components/CookieConsentBanner';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://tikeo.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tikeo - Billetterie Événementielle Nouvelle Génération',
    template: '%s | Tikeo',
  },
  description:
    'Découvrez et réservez les meilleurs événements près de chez vous. Concerts, festivals, spectacles et bien plus encore sur Tikeo.',
  keywords: [
    'billetterie',
    'événements',
    'concerts',
    'festivals',
    'spectacles',
    'tickets',
    'réservation',
    'achat billet',
    'événementiel',
  ],
  authors: [{ name: 'Tikeo' }],
  creator: 'Tikeo',
  publisher: 'Tikeo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      fr: SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Tikeo',
    title: 'Tikeo - Billetterie Événementielle Nouvelle Génération',
    description:
      'Découvrez et réservez les meilleurs événements près de chez vous. Concerts, festivals, spectacles et bien plus encore.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tikeo - Réservez vos événements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tikeo - Billetterie Événementielle',
    description:
      'Découvrez et réservez les meilleurs événements près de chez vous.',
    images: ['/og-image.jpg'],
    creator: '@tikeo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5B7CFF' },
    { media: '(prefers-color-scheme: dark)', color: '#5B7CFF' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" hrefLang="fr" href={SITE_URL} />
        <meta name="googlebot" content="notranslate" />
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tikeo',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description:
                'Plateforme de billetterie événementielle nouvelle génération',
              sameAs: [
                'https://facebook.com/tikeo',
                'https://twitter.com/tikeo',
                'https://instagram.com/tikeo',
                'https://linkedin.com/company/tikeo',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+33-1-23-45-67-89',
                contactType: 'customer service',
                availableLanguage: 'French',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <GlassFooter />
            <CookieConsentBanner />
          </div>
        </Providers>
      </body>
    </html>
  );
}
