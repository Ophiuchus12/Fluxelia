import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18nConfig, isValidLocale, type Locale } from './lib/i18n/config'

// Paths qui ne doivent pas être traités par le middleware
const PUBLIC_FILE = /\.(.*)$/
const EXCLUDED_PATHS = ['/api', '/_next', '/favicon.ico', '/robots.txt', '/sitemap']

// Mapping des routes FR <-> EN
const ROUTE_TRANSLATIONS: Record<string, Record<Locale, string>> = {
    tendances: { fr: 'tendances', en: 'trending' },
    trending: { fr: 'tendances', en: 'trending' },
    recherche: { fr: 'recherche', en: 'search' },
    search: { fr: 'recherche', en: 'search' },
    categorie: { fr: 'categorie', en: 'category' },
    category: { fr: 'categorie', en: 'category' },
}

/**
 * Traduit un pathname vers la locale cible
 */
function translatePathname(pathname: string, targetLocale: Locale): string {
    let translated = pathname

    for (const [route, translations] of Object.entries(ROUTE_TRANSLATIONS)) {
        const targetRoute = translations[targetLocale]
        // Remplacer le segment de route
        translated = translated.replace(
            new RegExp(`^/${route}(/|$)`),
            `/${targetRoute}$1`
        )
    }

    return translated
}

/**
 * Détecte la langue préférée du navigateur
 */
function getPreferredLocale(request: NextRequest): Locale {
    // 1. Vérifier le cookie de préférence
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    if (cookieLocale && isValidLocale(cookieLocale)) {
        return cookieLocale
    }

    // 2. Vérifier l'en-tête Accept-Language
    const acceptLanguage = request.headers.get('Accept-Language')
    if (acceptLanguage) {
        const languages = acceptLanguage
            .split(',')
            .map(lang => {
                const [code, priority] = lang.trim().split(';q=')
                return {
                    code: code.split('-')[0].toLowerCase(),
                    priority: priority ? parseFloat(priority) : 1,
                }
            })
            .sort((a, b) => b.priority - a.priority)

        for (const { code } of languages) {
            if (isValidLocale(code)) {
                return code
            }
        }
    }

    // 3. Retourner la locale par défaut
    return i18nConfig.defaultLocale
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Ignorer les fichiers publics et les chemins exclus
    if (
        PUBLIC_FILE.test(pathname) ||
        EXCLUDED_PATHS.some(path => pathname.startsWith(path))
    ) {
        return NextResponse.next()
    }

    // Extraire la locale du pathname
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]
    const pathnameHasLocale = firstSegment && isValidLocale(firstSegment)

    // Si le pathname a déjà une locale valide
    if (pathnameHasLocale) {
        const localeInPath = firstSegment as Locale

        // Si c'est la locale par défaut (fr), rediriger sans le préfixe
        if (localeInPath === i18nConfig.defaultLocale) {
            const pathWithoutLocale = '/' + segments.slice(1).join('/')
            // Traduire vers FR
            const translatedPath = translatePathname(pathWithoutLocale, 'fr')

            const url = request.nextUrl.clone()
            url.pathname = translatedPath || '/'

            const response = NextResponse.redirect(url)
            response.cookies.set('NEXT_LOCALE', localeInPath, {
                maxAge: 60 * 60 * 24 * 365, // 1 an
                path: '/',
            })
            return response
        }

        // Sinon, continuer avec la locale dans l'URL et mettre à jour le cookie
        const response = NextResponse.next()
        response.cookies.set('NEXT_LOCALE', localeInPath, {
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
        })
        return response
    }

    // Pas de locale dans le pathname - c'est une route FR
    const preferredLocale = getPreferredLocale(request)

    // Si la locale préférée n'est pas la locale par défaut, rediriger vers la version localisée
    if (preferredLocale !== i18nConfig.defaultLocale) {
        // Traduire le pathname vers la locale cible
        const translatedPath = translatePathname(pathname, preferredLocale)

        const url = request.nextUrl.clone()
        url.pathname = `/${preferredLocale}${translatedPath}`

        const response = NextResponse.redirect(url)
        response.cookies.set('NEXT_LOCALE', preferredLocale, {
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
        })
        return response
    }

    // Locale par défaut (fr), pas besoin de préfixe
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', i18nConfig.defaultLocale, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
    })
    return response
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
}