// ============================================
// CONSTANTES SEO POUR FLUXELIA
// ============================================

export const SITE_CONFIG = {
    name: 'Fluxelia',
    url: 'https://fluxelia.fr',
    locale: 'fr_FR',
    language: 'fr',
    author: 'Fluxelia',
    twitterHandle: '@fluxelia', // À personnaliser si tu as un compte Twitter
} as const

export const DEFAULT_SEO = {
    title: 'Fluxelia - Agrégateur d\'actualités intelligent | Veille en temps réel',
    description: 'Fluxelia centralise l\'actualité de 7+ sources : tech, économie, sport, santé, environnement. Restez informé avec notre agrégateur RSS intelligent mis à jour en continu.',
    keywords: [
        'agrégateur actualités',
        'veille informationnelle',
        'flux RSS',
        'actualités tech',
        'actualités économie',
        'news en temps réel',
        'agrégateur RSS',
        'veille technologique',
        'actualités France',
        'news aggregator',
    ],
} as const

// SEO par catégorie
export const CATEGORY_SEO: Record<string, {
    title: string
    description: string
    keywords: string[]
    emoji: string
}> = {
    technologie: {
        title: 'Actualités Tech & Innovation',
        description: 'Les dernières actualités technologiques : IA, cybersécurité, startups, gadgets et innovations. Veille tech mise à jour en temps réel.',
        keywords: ['actualités tech', 'news technologie', 'innovation', 'IA', 'intelligence artificielle', 'cybersécurité', 'startups'],
        emoji: '💻',
    },
    economie: {
        title: 'Actualités Économie & Finance',
        description: 'Suivez l\'actualité économique et financière : marchés, entreprises, cryptomonnaies, analyses et tendances économiques.',
        keywords: ['actualités économie', 'news finance', 'marchés financiers', 'bourse', 'crypto', 'entreprises'],
        emoji: '📈',
    },
    environnement: {
        title: 'Actualités Environnement & Écologie',
        description: 'Toute l\'actualité environnementale : climat, énergies renouvelables, biodiversité, développement durable et transition écologique.',
        keywords: ['actualités environnement', 'news écologie', 'climat', 'énergies renouvelables', 'développement durable'],
        emoji: '🌱',
    },
    sport: {
        title: 'Actualités Sport',
        description: 'L\'essentiel de l\'actualité sportive : football, tennis, rugby, JO, résultats et analyses des compétitions en cours.',
        keywords: ['actualités sport', 'news football', 'résultats sportifs', 'ligue 1', 'tennis', 'rugby'],
        emoji: '⚽',
    },
    sante: {
        title: 'Actualités Santé & Bien-être',
        description: 'Actualités santé, médecine et bien-être : recherche médicale, prévention, nutrition, conseils santé et avancées scientifiques.',
        keywords: ['actualités santé', 'news médecine', 'bien-être', 'recherche médicale', 'nutrition', 'prévention'],
        emoji: '🏥',
    },
    actualites: {
        title: 'Actualités Générales France & Monde',
        description: 'L\'actualité générale en France et dans le monde : politique, société, international, faits divers et événements marquants.',
        keywords: ['actualités France', 'news monde', 'politique', 'société', 'international', 'faits divers'],
        emoji: '📰',
    },
}

// Pages statiques SEO
export const PAGES_SEO = {
    home: {
        title: DEFAULT_SEO.title,
        description: DEFAULT_SEO.description,
    },
    tendances: {
        title: 'Tendances du jour - Les actualités les plus récentes | Fluxelia',
        description: 'Découvrez les tendances du moment : les 5 articles les plus récents de chaque catégorie. Tech, économie, sport, santé - restez à la pointe de l\'actualité.',
    },
    about: {
        title: 'À propos de Fluxelia - Notre mission | Agrégateur d\'actualités',
        description: 'Fluxelia est un agrégateur d\'actualités open-source qui centralise les flux RSS de sources fiables. Découvrez notre projet et notre technologie.',
    },
}

// Structured Data templates
export const STRUCTURED_DATA = {
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/icon.png`,
        description: DEFAULT_SEO.description,
        sameAs: [
            // Ajouter tes réseaux sociaux ici
            // 'https://twitter.com/fluxelia',
            // 'https://github.com/ton-username/fluxelia',
        ],
    },
    website: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: DEFAULT_SEO.description,
        inLanguage: SITE_CONFIG.language,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_CONFIG.url}/?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    },
}

// Helper pour générer les métadonnées d'une catégorie
export function getCategorySeo(slug: string) {
    const seo = CATEGORY_SEO[slug]
    if (!seo) return null

    return {
        title: `${seo.title} | Fluxelia`,
        description: seo.description,
        keywords: [...seo.keywords, ...DEFAULT_SEO.keywords.slice(0, 3)],
        emoji: seo.emoji,
    }
}