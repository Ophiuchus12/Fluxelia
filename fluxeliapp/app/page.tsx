import { Metadata } from 'next'
import { Suspense } from 'react'
import { getArticles, getCategories, getStats } from '@/lib/db'
import { SITE_CONFIG, DEFAULT_SEO } from '@/lib/seo-config'
import { JsonLd, generateHomePageJsonLd, generateBreadcrumbJsonLd } from './components/JsonLd'
import { HomeClient } from './HomeClient'

// ============================================
// MÉTADONNÉES SEO DE LA PAGE D'ACCUEIL
// ============================================
export const metadata: Metadata = {
  title: DEFAULT_SEO.title,
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

  alternates: {
    canonical: SITE_CONFIG.url,
  },

  openGraph: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    url: SITE_CONFIG.url,
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
  },
}

// ============================================
// COMPOSANT DE CHARGEMENT
// ============================================
function ArticlesSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-700 rounded mb-3"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// PAGE D'ACCUEIL (SERVER COMPONENT)
// ============================================
export default async function HomePage() {
  // Récupération des données côté serveur (SSR)
  const [articlesData, categories, stats] = await Promise.all([
    getArticles(undefined, 20, 1),
    getCategories(),
    getStats(),
  ])

  // Données structurées JSON-LD
  const homeJsonLd = generateHomePageJsonLd(stats.countArticles, categories)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Accueil', url: SITE_CONFIG.url },
  ])

  return (
    <>
      {/* JSON-LD pour cette page */}
      <JsonLd type="breadcrumb" data={breadcrumbJsonLd} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* Contenu SEO statique (visible par les crawlers) */}
      <div className="sr-only">
        <h1>Fluxelia - Agrégateur d'actualités intelligent</h1>
        <p>{DEFAULT_SEO.description}</p>
        <nav aria-label="Catégories disponibles">
          <h2>Catégories d'actualités</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat}>
                <a href={`/categorie/${cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                  Actualités {cat}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p>
          {stats.countArticles} articles disponibles dans {stats.countCategories} catégories.
          Sources: Korben, Le Monde, Le Figaro, Actu-Environnement, Santé Magazine, et plus.
        </p>
      </div>

      {/* Composant client interactif */}
      <Suspense fallback={<ArticlesSkeleton />}>
        <HomeClient
          initialArticles={articlesData.articles}
          initialCategories={categories}
          initialStats={stats}
          initialPagination={articlesData.pagination}
        />
      </Suspense>
    </>
  )
}

// Revalidation ISR: régénérer la page toutes les 5 minutes
export const revalidate = 300