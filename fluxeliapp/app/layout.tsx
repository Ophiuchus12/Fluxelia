import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SITE_CONFIG, DEFAULT_SEO } from '@/lib/seo-config'
import { JsonLd } from './components/JsonLd'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Optimisation du chargement des fonts
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

// ============================================
// MÉTADONNÉES GLOBALES SEO
// ============================================
export const metadata: Metadata = {
  // Métadonnées de base
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: DEFAULT_SEO.title,
    template: '%s | Fluxelia', // Pour les pages enfants
  },
  description: DEFAULT_SEO.description,
  keywords: [
    'actualités',
    'news',
    'agrégateur',
    'flux RSS',
    'veille',
    'information',
    'technologie',
    'économie',
    'environnement',
    'sport',
    'santé',
    'France',
  ],
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,

  // Robots
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

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [
      {
        url: '/og-image.png', // À créer: image 1200x630px
        width: 1200,
        height: 630,
        alt: 'Fluxelia - Agrégateur d\'actualités intelligent',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: ['/og-image.png'],
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
  },

  // Icônes
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Manifest pour PWA (optionnel)
  manifest: '/manifest.json',

  // Canonical & Alternates
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'fr-FR': SITE_CONFIG.url,
    },
  },

  // Vérification (à personnaliser avec tes IDs)
  verification: {
    google: 'GOOGLE_SITE_VERIFICATION_ID', // À remplacer
    // yandex: 'YANDEX_VERIFICATION_ID',
    // bing: 'BING_VERIFICATION_ID',
  },

  // Catégorie du site
  category: 'news',

  // Classification
  classification: 'News Aggregator',
}

// ============================================
// VIEWPORT CONFIGURATION
// ============================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

// ============================================
// ROOT LAYOUT
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Preconnect pour optimiser le chargement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch pour les sources RSS */}
        <link rel="dns-prefetch" href="https://korben.info" />
        <link rel="dns-prefetch" href="https://www.lemonde.fr" />
        <link rel="dns-prefetch" href="https://www.lefigaro.fr" />

        {/* JSON-LD Global: Organization */}
        <JsonLd type="organization" />

        {/* JSON-LD Global: WebSite avec SearchAction */}
        <JsonLd type="website" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        {/* Skip to content pour l'accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg"
        >
          Aller au contenu principal
        </a>

        {children}
      </body>
    </html>
  )
}