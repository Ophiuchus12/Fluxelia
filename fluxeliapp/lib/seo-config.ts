import { Locale, i18nConfig, categoryNames, categoryEmojis } from './i18n'

// ============================================
// CONFIGURATION DU SITE
// ============================================

export const SITE_CONFIG = {
    name: 'Fluxelia',
    url: 'https://fluxelia.fr',
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    language: 'fr', // Langue par défaut pour rétrocompatibilité
    locale: 'fr_FR',
    author: 'Fluxelia',
    twitterHandle: '@fluxelia',
} as const

// ============================================
// SEO PAR DÉFAUT (PAR LANGUE)
// ============================================

export const DEFAULT_SEO: Record<Locale, { title: string; description: string; keywords: string[] }> = {
    fr: {
        title: "Fluxelia - Agrégateur d'actualités intelligent | Veille en temps réel",
        description: "Fluxelia centralise l'actualité de 10+ sources : tech, économie, sport, santé, environnement. Restez informé avec notre agrégateur RSS intelligent mis à jour en continu.",
        keywords: [
            'agrégateur actualités',
            'veille informationnelle',
            'flux RSS',
            'actualités tech',
            'actualités économie',
            'news en temps réel',
            'actualités France',
        ],
    },
    en: {
        title: 'Fluxelia - Smart News Aggregator | Real-time Monitoring',
        description: 'Fluxelia centralizes news from 10+ sources: tech, economy, sports, health, environment. Stay informed with our smart RSS aggregator updated continuously.',
        keywords: [
            'news aggregator',
            'RSS feed reader',
            'tech news',
            'business news',
            'real-time news',
            'news monitoring',
        ],
    },
}

// ============================================
// SEO DES CATÉGORIES (PAR LANGUE)
// ============================================

export const CATEGORY_SEO: Record<string, Record<Locale, {
    title: string
    description: string
    keywords: string[]
}>> = {
    technologie: {
        fr: {
            title: 'Actualités Tech & Innovation',
            description: "Les dernières actualités technologiques : IA, cybersécurité, startups, gadgets et innovations. Veille tech mise à jour en temps réel.",
            keywords: ['actualités tech', 'news technologie', 'innovation', 'IA', 'cybersécurité', 'startups'],
        },
        en: {
            title: 'Tech & Innovation News',
            description: 'Latest technology news: AI, cybersecurity, startups, gadgets and innovations. Real-time tech monitoring.',
            keywords: ['tech news', 'technology', 'innovation', 'AI', 'cybersecurity', 'startups'],
        },
    },
    economie: {
        fr: {
            title: 'Actualités Économie & Finance',
            description: "Suivez l'actualité économique et financière : marchés, entreprises, analyses et tendances économiques.",
            keywords: ['actualités économie', 'news finance', 'marchés financiers', 'bourse', 'entreprises'],
        },
        en: {
            title: 'Economy & Finance News',
            description: 'Follow economic and financial news: markets, companies, analysis and economic trends.',
            keywords: ['economy news', 'finance news', 'financial markets', 'stock market', 'business'],
        },
    },
    environnement: {
        fr: {
            title: 'Actualités Environnement & Écologie',
            description: "Toute l'actualité environnementale : climat, énergies renouvelables, biodiversité, développement durable.",
            keywords: ['actualités environnement', 'news écologie', 'climat', 'énergies renouvelables', 'développement durable'],
        },
        en: {
            title: 'Environment & Ecology News',
            description: 'All environmental news: climate, renewable energy, biodiversity, sustainable development.',
            keywords: ['environment news', 'ecology', 'climate', 'renewable energy', 'sustainable development'],
        },
    },
    sport: {
        fr: {
            title: 'Actualités Sport',
            description: "L'essentiel de l'actualité sportive : football, tennis, rugby, résultats et analyses des compétitions.",
            keywords: ['actualités sport', 'news football', 'résultats sportifs', 'tennis', 'rugby'],
        },
        en: {
            title: 'Sports News',
            description: 'Essential sports news: football, tennis, rugby, results and competition analysis.',
            keywords: ['sports news', 'football', 'soccer', 'tennis', 'rugby', 'results'],
        },
    },
    sante: {
        fr: {
            title: 'Actualités Santé & Bien-être',
            description: 'Actualités santé, médecine et bien-être : recherche médicale, prévention, nutrition, conseils santé.',
            keywords: ['actualités santé', 'news médecine', 'bien-être', 'recherche médicale', 'nutrition'],
        },
        en: {
            title: 'Health & Wellness News',
            description: 'Health, medicine and wellness news: medical research, prevention, nutrition, health tips.',
            keywords: ['health news', 'medicine', 'wellness', 'medical research', 'nutrition'],
        },
    },
    actualites: {
        fr: {
            title: 'Actualités Générales France & Monde',
            description: "L'actualité générale en France et dans le monde : politique, société, international, événements marquants.",
            keywords: ['actualités France', 'news monde', 'politique', 'société', 'international'],
        },
        en: {
            title: 'General News France & World',
            description: 'General news in France and around the world: politics, society, international, major events.',
            keywords: ['France news', 'world news', 'politics', 'society', 'international'],
        },
    },
}

// ============================================
// SEO DES PAGES STATIQUES (PAR LANGUE)
// ============================================

export const PAGES_SEO: Record<string, Record<Locale, { title: string; description: string }>> = {
    home: {
        fr: {
            title: DEFAULT_SEO.fr.title,
            description: DEFAULT_SEO.fr.description,
        },
        en: {
            title: DEFAULT_SEO.en.title,
            description: DEFAULT_SEO.en.description,
        },
    },
    tendances: {
        fr: {
            title: 'Tendances du jour - Les actualités les plus récentes | Fluxelia',
            description: "Découvrez les tendances du moment : les 5 articles les plus récents de chaque catégorie. Tech, économie, sport, santé.",
        },
        en: {
            title: "Today's Trends - Latest News | Fluxelia",
            description: "Discover today's trends: the 5 most recent articles in each category. Tech, economy, sports, health.",
        },
    },
    about: {
        fr: {
            title: "À propos de Fluxelia - Notre mission | Agrégateur d'actualités",
            description: "Fluxelia est un agrégateur d'actualités open-source qui centralise les flux RSS de sources fiables.",
        },
        en: {
            title: 'About Fluxelia - Our Mission | News Aggregator',
            description: 'Fluxelia is an open-source news aggregator that centralizes RSS feeds from trusted sources.',
        },
    },
    search: {
        fr: {
            title: 'Recherche | Fluxelia',
            description: 'Recherchez parmi des milliers d\'articles de sources fiables.',
        },
        en: {
            title: 'Search | Fluxelia',
            description: 'Search among thousands of articles from trusted sources.',
        },
    },
}

// ============================================
// STRUCTURED DATA
// ============================================

export const STRUCTURED_DATA = {
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/icon.png`,
        description: DEFAULT_SEO.fr.description,
    },
    website: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: DEFAULT_SEO.fr.description,
        inLanguage: 'fr',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_CONFIG.url}/recherche?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    },
}

// ============================================
// HELPERS
// ============================================

/**
 * Récupère le SEO d'une catégorie pour une langue
 */
export function getCategorySeo(slug: string, locale: Locale = 'fr') {
    const seo = CATEGORY_SEO[slug]?.[locale]
    if (!seo) return null

    return {
        title: `${seo.title} | Fluxelia`,
        description: seo.description,
        keywords: [...seo.keywords, ...DEFAULT_SEO[locale].keywords.slice(0, 3)],
        emoji: categoryEmojis[slug] ?? '📄',
    }
}

/**
 * Génère les balises hreflang pour le SEO multilingue
 */
export function generateHreflangTags(path: string) {
    return i18nConfig.locales.map(locale => ({
        hrefLang: locale,
        href: locale === i18nConfig.defaultLocale
            ? `${SITE_CONFIG.url}${path}`
            : `${SITE_CONFIG.url}/${locale}${path}`,
    }))
}

/**
 * Génère l'URL canonique pour une page
 */
export function getCanonicalUrl(path: string, locale: Locale): string {
    if (locale === i18nConfig.defaultLocale) {
        return `${SITE_CONFIG.url}${path}`
    }
    return `${SITE_CONFIG.url}/${locale}${path}`
}