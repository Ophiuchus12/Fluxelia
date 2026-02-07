// ============================================
// CONFIGURATION INTERNATIONALISATION (i18n)
// ============================================

export const i18nConfig = {
    defaultLocale: 'fr',
    locales: ['fr', 'en'] as const,
    localeNames: {
        fr: 'Français',
        en: 'English',
    },
    localeFlags: {
        fr: '🇫🇷',
        en: '🇬🇧',
    },
} as const

export type Locale = (typeof i18nConfig.locales)[number]

// ============================================
// MAPPING CATÉGORIES PAR LANGUE
// ============================================

export const categoryNames: Record<string, Record<Locale, string>> = {
    technologie: { fr: 'Technologie', en: 'Technology' },
    economie: { fr: 'Économie', en: 'Economy' },
    environnement: { fr: 'Environnement', en: 'Environment' },
    sport: { fr: 'Sport', en: 'Sports' },
    sante: { fr: 'Santé', en: 'Health' },
    actualites: { fr: 'Actualités', en: 'News' },
}

export const categoryEmojis: Record<string, string> = {
    technologie: '💻',
    economie: '📈',
    environnement: '🌱',
    sport: '⚽',
    sante: '🏥',
    actualites: '📰',
}

// ============================================
// HELPERS
// ============================================

/**
 * Vérifie si une locale est valide
 */
export function isValidLocale(locale: string): locale is Locale {
    return i18nConfig.locales.includes(locale as Locale)
}

/**
 * Récupère le nom de la catégorie dans la bonne langue
 */
export function getCategoryName(slug: string, locale: Locale): string {
    return categoryNames[slug]?.[locale] ?? slug
}

/**
 * Récupère l'emoji d'une catégorie
 */
export function getCategoryEmoji(slug: string): string {
    return categoryEmojis[slug] ?? '📄'
}

/**
 * Récupère toutes les catégories pour une langue
 */
export function getAllCategories(locale: Locale) {
    return Object.entries(categoryNames).map(([slug, names]) => ({
        slug,
        name: names[locale],
        emoji: categoryEmojis[slug],
    }))
}

/**
 * Génère le chemin localisé
 * Gère aussi la traduction des slugs de pages (tendances -> trending, etc.)
 */
export function getLocalizedPath(path: string, locale?: Locale | null): string {
    // Fallback sur la locale par défaut si undefined/null
    const safeLocale = locale ?? i18nConfig.defaultLocale
    
    // Si c'est la locale par défaut (fr), pas de préfixe
    if (safeLocale === i18nConfig.defaultLocale) {
        return path
    }
    
    // Pour EN, traduire les slugs de pages
    let translatedPath = path
    if (safeLocale === 'en') {
        // Mapping des routes FR -> EN
        translatedPath = translatedPath
            .replace(/^\/tendances/, '/trending')
            .replace(/^\/recherche/, '/search')
            .replace(/^\/categorie\//, '/category/')
    }
    
    // Ajouter le préfixe de langue
    return `/${safeLocale}${translatedPath}`
}

/**
 * Extrait la locale d'un pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]
    
    if (firstSegment && isValidLocale(firstSegment)) {
        return firstSegment
    }
    
    return i18nConfig.defaultLocale
}

/**
 * Supprime le préfixe de locale d'un pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]
    
    if (firstSegment && isValidLocale(firstSegment)) {
        return '/' + segments.slice(1).join('/')
    }
    
    return pathname
}
