import { SITE_CONFIG, STRUCTURED_DATA } from '@/lib/seo-config'
import { Article } from '@/types/article'
import { Locale } from '@/lib/i18n'

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
    articleCount: number,
    locale: Locale = 'fr'
): Record<string, unknown> {
    const basePath = locale === 'fr' ? '/categorie' : '/en/category'
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: locale === 'fr' ? `Actualités ${categoryName}` : `${categoryName} News`,
        description,
        url: `${SITE_CONFIG.url}${basePath}/${categorySlug}`,
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
        inLanguage: locale,
    }
}

/**
 * Génère le JSON-LD pour la page d'accueil
 */
export function generateHomePageJsonLd(
    totalArticles: number,
    categories: string[],
    locale: Locale = 'fr'
): Record<string, unknown> {
    const basePath = locale === 'fr' ? '/categorie' : '/en/category'
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: locale === 'fr' 
            ? 'Fluxelia - Agrégateur d\'actualités intelligent'
            : 'Fluxelia - Smart News Aggregator',
        description: locale === 'fr'
            ? 'Centralisez votre veille : tech, économie, sport, santé, environnement. Actualités en temps réel de sources fiables.'
            : 'Centralize your news: tech, economy, sports, health, environment. Real-time news from trusted sources.',
        url: locale === 'fr' ? SITE_CONFIG.url : `${SITE_CONFIG.url}/en`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        about: {
            '@type': 'Thing',
            name: locale === 'fr' ? 'Agrégation d\'actualités' : 'News Aggregation',
        },
        mainEntity: {
            '@type': 'ItemList',
            name: locale === 'fr' ? 'Catégories d\'actualités' : 'News Categories',
            numberOfItems: categories.length,
            itemListElement: categories.map((cat, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: cat,
                url: `${SITE_CONFIG.url}${basePath}/${cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
            })),
        },
        specialty: locale === 'fr' 
            ? `${totalArticles} articles disponibles`
            : `${totalArticles} articles available`,
        inLanguage: locale,
    }
}

/**
 * Génère le JSON-LD pour la page Tendances
 */
export function generateTrendingPageJsonLd(
    articles: Article[],
    locale: Locale = 'fr'
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: locale === 'fr' ? 'Tendances - Actualités du moment' : 'Trending - Latest News',
        description: locale === 'fr' 
            ? 'Les articles les plus récents dans chaque catégorie.'
            : 'The most recent articles in each category.',
        url: locale === 'fr' ? `${SITE_CONFIG.url}/tendances` : `${SITE_CONFIG.url}/en/trending`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        mainEntity: generateItemListJsonLd(articles, locale === 'fr' ? 'Articles tendances' : 'Trending Articles'),
        inLanguage: locale,
    }
}

/**
 * Génère le JSON-LD pour la page À propos
 */
export function generateAboutPageJsonLd(locale: Locale = 'fr'): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: locale === 'fr' ? 'À propos de Fluxelia' : 'About Fluxelia',
        description: locale === 'fr'
            ? 'Fluxelia est un agrégateur d\'actualités open-source centralisant des flux RSS de sources fiables.'
            : 'Fluxelia is an open-source news aggregator centralizing RSS feeds from trusted sources.',
        url: locale === 'fr' ? `${SITE_CONFIG.url}/about` : `${SITE_CONFIG.url}/en/about`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        mainEntity: STRUCTURED_DATA.organization,
        inLanguage: locale,
    }
}
