import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'
import { Article } from '@/types/article'
import { Locale, i18nConfig, categoryNames } from './i18n'

// Singleton pour la connexion DB
let db: Database | null = null

export async function getDb(): Promise<Database> {
    if (db) return db

    const dbPath = path.resolve(process.cwd(), '../rss_feed.db')
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    })

    return db
}

// ============================================
// TYPES
// ============================================

export interface ArticlesResult {
    articles: Article[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface StatsResult {
    countArticles: number
    countCategories: number
}

// ============================================
// FONCTIONS AVEC SUPPORT i18n
// ============================================

/**
 * Récupère les articles avec pagination et filtrage par langue
 */
export async function getArticles(
    categorySlug?: string,
    limit: number = 20,
    page: number = 1,
    lang: Locale = i18nConfig.defaultLocale
): Promise<ArticlesResult> {
    const db = await getDb()
    const offset = (page - 1) * limit

    let articles: Article[]
    let totalCount: number

    if (categorySlug && categorySlug !== 'all' && categorySlug !== 'toutes') {
        articles = await db.all<Article[]>(
            `SELECT * FROM articles 
             WHERE category_slug = ? AND lang = ? 
             ORDER BY published_at DESC 
             LIMIT ? OFFSET ?`,
            [categorySlug, lang, limit, offset]
        )

        const count = await db.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM articles WHERE category_slug = ? AND lang = ?`,
            [categorySlug, lang]
        )
        totalCount = count?.count ?? 0
    } else {
        articles = await db.all<Article[]>(
            `SELECT * FROM articles 
             WHERE lang = ? 
             ORDER BY published_at DESC 
             LIMIT ? OFFSET ?`,
            [lang, limit, offset]
        )

        const count = await db.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM articles WHERE lang = ?`,
            [lang]
        )
        totalCount = count?.count ?? 0
    }

    return {
        articles,
        pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    }
}

/**
 * Récupère toutes les catégories disponibles pour une langue
 */
export async function getCategories(lang: Locale = i18nConfig.defaultLocale): Promise<string[]> {
    const db = await getDb()
    const categories = await db.all<{ category: string }[]>(
        `SELECT DISTINCT category FROM articles WHERE lang = ? ORDER BY category ASC`,
        [lang]
    )
    return categories.map(c => c.category)
}

/**
 * Récupère les slugs des catégories disponibles
 */
export async function getCategorySlugs(lang: Locale = i18nConfig.defaultLocale): Promise<string[]> {
    const db = await getDb()
    const slugs = await db.all<{ category_slug: string }[]>(
        `SELECT DISTINCT category_slug FROM articles WHERE lang = ? ORDER BY category_slug ASC`,
        [lang]
    )
    return slugs.map(s => s.category_slug)
}

/**
 * Récupère les statistiques globales pour une langue
 */
export async function getStats(lang: Locale = i18nConfig.defaultLocale): Promise<StatsResult> {
    const db = await getDb()
    const stats = await db.get<StatsResult>(`
        SELECT 
            COUNT(*) AS countArticles,
            COUNT(DISTINCT category_slug) AS countCategories
        FROM articles
        WHERE lang = ?
    `, [lang])

    return stats ?? { countArticles: 0, countCategories: 0 }
}

/**
 * Récupère les tendances (5 derniers articles par catégorie) pour une langue
 */
export async function getTendances(lang: Locale = i18nConfig.defaultLocale): Promise<Article[]> {
    const db = await getDb()

    const tendances = await db.all<Article[]>(`
        SELECT *
        FROM (
            SELECT *,
                ROW_NUMBER() OVER (PARTITION BY category_slug ORDER BY published_at DESC) as row_num
            FROM articles
            WHERE lang = ?
        )
        WHERE row_num <= 5
    `, [lang])

    return tendances
}

/**
 * Récupère les articles d'une catégorie par son slug
 */
export async function getArticlesBySlug(
    slug: string,
    limit: number = 20,
    page: number = 1,
    lang: Locale = i18nConfig.defaultLocale
): Promise<ArticlesResult> {
    return getArticles(slug, limit, page, lang)
}

/**
 * Recherche d'articles
 */
export async function searchArticles(
    query: string,
    categorySlug: string | null = null,
    limit: number = 20,
    page: number = 1,
    lang: Locale = i18nConfig.defaultLocale
): Promise<ArticlesResult> {
    const db = await getDb()
    const offset = (page - 1) * limit
    const searchPattern = `%${query}%`

    let articles: Article[]
    let totalCount: number

    if (categorySlug && categorySlug !== 'all' && categorySlug !== 'toutes') {
        articles = await db.all<Article[]>(
            `SELECT * FROM articles 
             WHERE lang = ? 
               AND category_slug = ?
               AND (title LIKE ? OR short_description LIKE ?)
             ORDER BY published_at DESC 
             LIMIT ? OFFSET ?`,
            [lang, categorySlug, searchPattern, searchPattern, limit, offset]
        )

        const count = await db.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM articles 
             WHERE lang = ? 
               AND category_slug = ?
               AND (title LIKE ? OR short_description LIKE ?)`,
            [lang, categorySlug, searchPattern, searchPattern]
        )
        totalCount = count?.count ?? 0
    } else {
        articles = await db.all<Article[]>(
            `SELECT * FROM articles 
             WHERE lang = ?
               AND (title LIKE ? OR short_description LIKE ?)
             ORDER BY published_at DESC 
             LIMIT ? OFFSET ?`,
            [lang, searchPattern, searchPattern, limit, offset]
        )

        const count = await db.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM articles 
             WHERE lang = ?
               AND (title LIKE ? OR short_description LIKE ?)`,
            [lang, searchPattern, searchPattern]
        )
        totalCount = count?.count ?? 0
    }

    return {
        articles,
        pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    }
}

/**
 * Mapping des slugs vers les noms de catégories (localisé)
 */
export function getCategoryFromSlug(slug: string, lang: Locale = i18nConfig.defaultLocale): string | null {
    const category = categoryNames[slug]
    return category ? category[lang] : null
}

/**
 * Mapping inverse: nom de catégorie -> slug
 */
export function getSlugFromCategory(category: string): string {
    for (const [slug, names] of Object.entries(categoryNames)) {
        if (Object.values(names).includes(category)) {
            return slug
        }
    }
    return category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Récupère toutes les catégories avec leur slug (localisé)
 */
export async function getCategoriesWithSlugs(lang: Locale = i18nConfig.defaultLocale): Promise<{ name: string; slug: string }[]> {
    const slugs = await getCategorySlugs(lang)
    return slugs.map(slug => ({
        name: getCategoryFromSlug(slug, lang) ?? slug,
        slug,
    }))
}