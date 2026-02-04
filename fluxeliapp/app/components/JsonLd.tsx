import { SITE_CONFIG, STRUCTURED_DATA } from '@/lib/seo-config'
import { Article } from '@/types/article'

interface JsonLdProps {
    type: 'website' | 'organization' | 'breadcrumb' | 'article' | 'itemList' | 'collectionPage'
    data?: Record<string, unknown>
}

export function JsonLd({ type, data }: JsonLdProps) {
    let structuredData: Record<string, unknown>

    switch (type) {
        case 'website':
            structuredData = STRUCTURED_DATA.website
            break
        case 'organization':
            structuredData = STRUCTURED_DATA.organization
            break
        case 'breadcrumb':
            structuredData = data ?? {}
            break
        case 'article':
            structuredData = data ?? {}
            break
        case 'itemList':
            structuredData = data ?? {}
            break
        case 'collectionPage':
            structuredData = data ?? {}
            break
        default:
            structuredData = data ?? {}
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

// ============================================
// HELPERS POUR GÉNÉRER LES DONNÉES STRUCTURÉES
// ============================================

/**
 * Génère le JSON-LD pour un fil d'Ariane (Breadcrumb)
 */
export function generateBreadcrumbJsonLd(
    items: { name: string; url: string }[]
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}

/**
 * Génère le JSON-LD pour une liste d'articles (ItemList)
 */
export function generateItemListJsonLd(
    articles: Article[],
    listName: string
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: listName,
        numberOfItems: articles.length,
        itemListElement: articles.slice(0, 10).map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'NewsArticle',
                headline: article.title,
                url: article.url,
                datePublished: article.published_at,
                description: article.short_description?.replace(/<[^>]*>/g, '').slice(0, 200),
                articleSection: article.category,
            },
        })),
    }
}

/**
 * Génère le JSON-LD pour une page de collection (catégorie)
 */
export function generateCollectionPageJsonLd(
    categoryName: string,
    categorySlug: string,
    description: string,
    articleCount: number
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Actualités ${categoryName}`,
        description,
        url: `${SITE_CONFIG.url}/categorie/${categorySlug}`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        about: {
            '@type': 'Thing',
            name: categoryName,
        },
        numberOfItems: articleCount,
        inLanguage: SITE_CONFIG.language,
    }
}

/**
 * Génère le JSON-LD pour la page d'accueil
 */
export function generateHomePageJsonLd(
    totalArticles: number,
    categories: string[]
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Fluxelia - Agrégateur d\'actualités intelligent',
        description: 'Centralisez votre veille : tech, économie, sport, santé, environnement. Actualités en temps réel de sources fiables.',
        url: SITE_CONFIG.url,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        about: {
            '@type': 'Thing',
            name: 'Agrégation d\'actualités',
        },
        mainEntity: {
            '@type': 'ItemList',
            name: 'Catégories d\'actualités',
            numberOfItems: categories.length,
            itemListElement: categories.map((cat, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: cat,
                url: `${SITE_CONFIG.url}/categorie/${cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
            })),
        },
        specialty: totalArticles + ' articles disponibles',
    }
}

/**
 * Génère le JSON-LD pour la page Tendances
 */
export function generateTrendingPageJsonLd(
    articles: Article[]
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Tendances - Actualités du moment',
        description: 'Les articles les plus récents dans chaque catégorie.',
        url: `${SITE_CONFIG.url}/tendances`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        mainEntity: generateItemListJsonLd(articles, 'Articles tendances'),
    }
}

/**
 * Génère le JSON-LD pour la page À propos
 */
export function generateAboutPageJsonLd(): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'À propos de Fluxelia',
        description: 'Fluxelia est un agrégateur d\'actualités open-source centralisant des flux RSS de sources fiables.',
        url: `${SITE_CONFIG.url}/about`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        mainEntity: STRUCTURED_DATA.organization,
    }
}