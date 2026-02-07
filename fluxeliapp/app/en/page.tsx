import { Metadata } from 'next'
import { Suspense } from 'react'
import { getArticles, getCategories, getStats } from '@/lib/db'
import { SITE_CONFIG, DEFAULT_SEO } from '@/lib/seo-config'
import { HomeClient } from '../HomeClient'

const locale = 'en'

// ============================================
// MÉTADONNÉES SEO EN
// ============================================
export const metadata: Metadata = {
    title: DEFAULT_SEO.en.title,
    description: DEFAULT_SEO.en.description,
    keywords: DEFAULT_SEO.en.keywords,
    alternates: {
        canonical: `${SITE_CONFIG.url}/en`,
        languages: {
            'fr': SITE_CONFIG.url,
            'en': `${SITE_CONFIG.url}/en`,
        },
    },
    openGraph: {
        title: DEFAULT_SEO.en.title,
        description: DEFAULT_SEO.en.description,
        url: `${SITE_CONFIG.url}/en`,
        type: 'website',
        locale: 'en_US',
    },
}

function ArticlesSkeleton() {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-20 mb-4" />
                        <div className="h-6 bg-gray-700 rounded mb-3" />
                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default async function HomePageEN() {
    const [articlesData, categories, stats] = await Promise.all([
        getArticles(undefined, 20, 1, locale),
        getCategories(locale),
        getStats(locale),
    ])

    return (
        <Suspense fallback={<ArticlesSkeleton />}>
            <HomeClient
                locale={locale}
                initialArticles={articlesData.articles}
                initialCategories={categories}
                initialStats={stats}
                initialPagination={articlesData.pagination}
            />
        </Suspense>
    )
}

export const revalidate = 300
