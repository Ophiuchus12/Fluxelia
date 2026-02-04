import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getArticlesBySlug, getCategoryFromSlug } from '@/lib/db'
import { SITE_CONFIG, getCategorySeo, CATEGORY_SEO } from '@/lib/seo-config'
import {
    JsonLd,
    generateBreadcrumbJsonLd,
    generateCollectionPageJsonLd,
    generateItemListJsonLd
} from '@/app/components/JsonLd'
import { CategoryClient } from './CategoryClient'

// ============================================
// TYPES
// ============================================
interface CategoryPageProps {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ page?: string }>
}

// ============================================
// GÉNÉRATION DES PAGES STATIQUES (SSG)
// ============================================
export async function generateStaticParams() {
    const slugs = Object.keys(CATEGORY_SEO)
    return slugs.map((slug) => ({ slug }))
}

// ============================================
// MÉTADONNÉES DYNAMIQUES
// ============================================
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params
    const seo = getCategorySeo(slug)
    const categoryName = getCategoryFromSlug(slug)

    if (!seo || !categoryName) {
        return {
            title: 'Catégorie non trouvée',
            description: 'Cette catégorie n\'existe pas.',
        }
    }

    const url = `${SITE_CONFIG.url}/categorie/${slug}`

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,

        alternates: {
            canonical: url,
        },

        openGraph: {
            title: `${seo.emoji} ${seo.title} | Fluxelia`,
            description: seo.description,
            url,
            type: 'website',
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
        },

        twitter: {
            card: 'summary_large_image',
            title: `${seo.emoji} ${seo.title}`,
            description: seo.description,
        },

        robots: {
            index: true,
            follow: true,
        },
    }
}

// ============================================
// COMPOSANT DE CHARGEMENT
// ============================================
function CategorySkeleton() {
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
// PAGE DE CATÉGORIE (SERVER COMPONENT)
// ============================================
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params
    const { page: pageParam } = await searchParams

    const categoryName = getCategoryFromSlug(slug)
    const seo = getCategorySeo(slug)

    if (!categoryName || !seo) {
        notFound()
    }

    const page = pageParam ? parseInt(pageParam, 10) : 1
    const articlesData = await getArticlesBySlug(slug, 20, page)

    // Données structurées JSON-LD
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: 'Accueil', url: SITE_CONFIG.url },
        { name: 'Catégories', url: `${SITE_CONFIG.url}/categorie` },
        { name: categoryName, url: `${SITE_CONFIG.url}/categorie/${slug}` },
    ])

    const collectionJsonLd = generateCollectionPageJsonLd(
        categoryName,
        slug,
        seo.description,
        articlesData.pagination.total
    )

    const itemListJsonLd = generateItemListJsonLd(
        articlesData.articles,
        `Actualités ${categoryName}`
    )

    return (
        <>
            {/* JSON-LD */}
            <JsonLd type="breadcrumb" data={breadcrumbJsonLd} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />

            {/* Contenu SEO statique */}
            <div className="sr-only">
                <h1>Actualités {categoryName} - Fluxelia</h1>
                <p>{seo.description}</p>
                <p>
                    {articlesData.pagination.total} articles disponibles dans la catégorie {categoryName}.
                    Page {page} sur {articlesData.pagination.totalPages}.
                </p>
                <nav aria-label="Articles de la catégorie">
                    <ul>
                        {articlesData.articles.slice(0, 10).map((article) => (
                            <li key={article.id}>
                                <a href={article.url}>{article.title}</a>
                                <time dateTime={article.published_at}>
                                    {new Date(article.published_at).toLocaleDateString('fr-FR')}
                                </time>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Composant client interactif */}
            <Suspense fallback={<CategorySkeleton />}>
                <CategoryClient
                    categoryName={categoryName}
                    categorySlug={slug}
                    categoryEmoji={seo.emoji}
                    categoryDescription={seo.description}
                    initialArticles={articlesData.articles}
                    initialPagination={articlesData.pagination}
                />
            </Suspense>
        </>
    )
}

export const revalidate = 300