import { Locale, i18nConfig } from './config'
import frTranslations from './locales/fr.json'
import enTranslations from './locales/en.json'

// Type pour les traductions
export type Translations = typeof frTranslations

// Map des traductions
const translations: Record<Locale, Translations> = {
    fr: frTranslations,
    en: enTranslations,
}

/**
 * Récupère les traductions pour une locale
 */
export function getTranslations(locale: Locale): Translations {
    return translations[locale] || translations[i18nConfig.defaultLocale]
}

/**
 * Récupère une traduction spécifique par chemin (ex: "header.articles")
 */
export function t(locale: Locale, path: string): string {
    const trans = getTranslations(locale)
    const keys = path.split('.')
    
    let result: unknown = trans
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = (result as Record<string, unknown>)[key]
        } else {
            console.warn(`Translation not found: ${path}`)
            return path
        }
    }
    
    return typeof result === 'string' ? result : path
}

/**
 * Hook-like function pour utiliser dans les Server Components
 */
export function useTranslations(locale: Locale) {
    const trans = getTranslations(locale)
    
    return {
        t: (path: string) => t(locale, path),
        translations: trans,
        locale,
    }
}

/**
 * Formate une date relative selon la locale
 */
export function formatRelativeDate(dateString: string, locale: Locale): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) {
        return locale === 'fr' ? "Il y a moins d'une heure" : "Less than an hour ago"
    }
    
    if (diffHours < 24) {
        return locale === 'fr' 
            ? `Il y a ${diffHours}h` 
            : `${diffHours}h ago`
    }
    
    if (diffDays < 7) {
        return locale === 'fr'
            ? `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
            : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    }

    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { 
        day: 'numeric', 
        month: 'short' 
    })
}
