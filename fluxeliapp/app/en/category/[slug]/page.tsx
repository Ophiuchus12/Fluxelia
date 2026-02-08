import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getArticlesBySlug, getCategoryFromSlug } from '@/lib/db'
import { SITE_CONFIG, getCategorySeo } from '@/lib/seo-config'
import { CategoryClient } from '@/app/categorie/[slug]/CategoryClient'

const locale = 'en'

// Force dynamic pour que searchParams fonctionne
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params
    const seo = getCategorySeo(slug, locale)
    const categoryName = getCategoryFromSlug(slug, locale)

    if (!seo || !categoryName) {
        return { title: 'Category not found' }
    }

    const url = `${SITE_CONFIG.url}/en/category/${slug}`

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: url,
            languages: {
                'fr': `${SITE_CONFIG.url}/categorie/${slug}`,
                'en': url,
            },
        },
        openGraph: {
            title: `${seo.emoji} ${seo.title}`,
            description: seo.description,
            url,
            type: 'website',
            locale: 'en_US',
        },
    }
}

function CategorySkeleton() {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-20 mb-4" />
                    <div className="h-6 bg-gray-700 rounded mb-3" />
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
            ))}
        </div>
    )
}

export default async function CategoryPageEN({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params
    const { page: pageParam } = await searchParams

    const categoryName = getCategoryFromSlug(slug, locale)
    const seo = getCategorySeo(slug, locale)

    if (!categoryName || !seo) {
        notFound()
    }

    const page = pageParam ? parseInt(pageParam, 10) : 1
    const articlesData = await getArticlesBySlug(slug, 20, page, locale)

    return (
        <Suspense fallback={<CategorySkeleton />}>
            <CategoryClient
                locale={locale}
                categoryName={categoryName}
                categorySlug={slug}
                categoryEmoji={seo.emoji}
                categoryDescription={seo.description}
                initialArticles={articlesData.articles}
                initialPagination={articlesData.pagination}
            />
        </Suspense>
    )
}

export const revalidate = 300