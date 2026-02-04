import { Metadata } from 'next'
import { Suspense } from 'react'
import { getTendances, getCategories } from '@/lib/db'
import { SITE_CONFIG, PAGES_SEO } from '@/lib/seo-config'
import { JsonLd, generateBreadcrumbJsonLd, generateTrendingPageJsonLd } from '../components/JsonLd'
import { TendancesClient } from './TendancesClient'

// ============================================
// MÉTADONNÉES SEO
// ============================================
export const metadata: Metadata = {
    title: PAGES_SEO.tendances.title,
    description: PAGES_SEO.tendances.description,

    keywords: [
        'tendances actualités',
        'news du jour',
        'dernières actualités',
        'articles populaires',
        'actualités en temps réel',
    ],

    alternates: {
        canonical: `${SITE_CONFIG.url}/tendances`,
    },

    openGraph: {
        title: PAGES_SEO.tendances.title,
        description: PAGES_SEO.tendances.description,
        url: `${SITE_CONFIG.url}/tendances`,
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Tendances du jour | Fluxelia',
        description: PAGES_SEO.tendances.description,
    },
}

// ============================================
// COMPOSANT DE CHARGEMENT
// ============================================
function TendancesSkeleton() {
    return (
        <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
                <div key={i}>
                    <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 animate-pulse">
                                <div className="h-4 bg-gray-700 rounded w-20 mb-3"></div>
                                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ============================================
// PAGE TENDANCES (SERVER COMPONENT)
// ============================================
export default async function TendancesPage() {
    const [articles, categories] = await Promise.all([
        getTendances(),
        getCategories(),
    ])

    // Grouper les articles par catégorie
    const articlesByCategory = articles.reduce((acc, article) => {
        if (!acc[article.category]) {
            acc[article.category] = []
        }
        acc[article.category].push(article)
        return acc
    }, {} as Record<string, typeof articles>)

    // Données structurées JSON-LD
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: 'Accueil', url: SITE_CONFIG.url },
        { name: 'Tendances', url: `${SITE_CONFIG.url}/tendances` },
    ])

    const trendingJsonLd = generateTrendingPageJsonLd(articles)

    return (
        <>
            {/* JSON-LD */}
            <JsonLd type="breadcrumb" data={breadcrumbJsonLd} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(trendingJsonLd) }}
            />

            {/* Contenu SEO statique */}
            <div className="sr-only">
                <h1>Tendances - Les actualités du moment sur Fluxelia</h1>
                <p>{PAGES_SEO.tendances.description}</p>
                <p>{articles.length} articles tendances répartis dans {categories.length} catégories.</p>

                {Object.entries(articlesByCategory).map(([category, catArticles]) => (
                    <section key={category}>
                        <h2>Tendances {category}</h2>
                        <ul>
                            {catArticles.map((article) => (
                                <li key={article.id}>
                                    <a href={article.url}>{article.title}</a>
                                    <time dateTime={article.published_at}>
                                        {new Date(article.published_at).toLocaleDateString('fr-FR')}
                                    </time>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            {/* Composant client */}
            <Suspense fallback={<TendancesSkeleton />}>
                <TendancesClient
                    initialArticles={articles}
                    articlesByCategory={articlesByCategory}
                />
            </Suspense>
        </>
    )
}

export const revalidate = 300