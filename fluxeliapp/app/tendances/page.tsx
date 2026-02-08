import { Metadata } from 'next'
import { Suspense } from 'react'
import { getTendances } from '@/lib/db'
import { SITE_CONFIG, PAGES_SEO } from '@/lib/seo-config'
import { TendancesClient } from './TendancesClient'

const locale = 'fr'

export const metadata: Metadata = {
    title: PAGES_SEO.tendances.fr.title,
    description: PAGES_SEO.tendances.fr.description,
    alternates: {
        canonical: `${SITE_CONFIG.url}/tendances`,
        languages: {
            'fr': `${SITE_CONFIG.url}/tendances`,
            'en': `${SITE_CONFIG.url}/en/trending`,
        },
    },
    openGraph: {
        title: PAGES_SEO.tendances.fr.title,
        description: PAGES_SEO.tendances.fr.description,
        url: `${SITE_CONFIG.url}/tendances`,
        type: 'website',
        locale: 'fr_FR',
    },
}

function TendancesSkeleton() {
    return (
        <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
                <div key={i}>
                    <div className="h-8 bg-gray-700 rounded w-48 mb-4" />
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-gray-700 rounded w-20 mb-3" />
                                <div className="h-6 bg-gray-700 rounded mb-2" />
                                <div className="h-4 bg-gray-700 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default async function TendancesPage() {
    const articles = await getTendances(locale)

    // Grouper par catégorie
    const articlesByCategory = articles.reduce((acc, article) => {
        const key = article.category_slug
        if (!acc[key]) acc[key] = []
        acc[key].push(article)
        return acc
    }, {} as Record<string, typeof articles>)

    return (
        <Suspense fallback={<TendancesSkeleton />}>
            <TendancesClient
                locale={locale}
                initialArticles={articles}
                articlesByCategory={articlesByCategory}
            />
        </Suspense>
    )
}

export const revalidate = 300
