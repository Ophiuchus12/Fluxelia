import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'
import { Article } from '@/types/article'

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
// FONCTIONS POUR LE SERVER-SIDE RENDERING
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

/**
 * Récupère les articles avec pagination (côté serveur)
 */
export async function getArticles(
    category?: string,
    limit: number = 20,
    page: number = 1
): Promise<ArticlesResult> {
    const db = await getDb()
    const offset = (page - 1) * limit

    let articles: Article[]
    let totalCount: number

    if (category && category !== 'Toutes') {
        articles = await db.all<Article[]>(
            `SELECT * FROM articles WHERE category = ? ORDER BY published_at DESC LIMIT ? OFFSET ?`,
            [category, limit, offset]
        )

        const count = await db.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM articles WHERE category = ?`,
            [category]
        )
        totalCount = count?.count ?? 0
    } else {
        articles = await db.all<Article[]>(
            `SELECT * FROM articles ORDER BY published_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )

        const count = await db.get<{ count: number }>(`SELECT COUNT(*) as count FROM articles`)
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
 * Récupère toutes les catégories disponibles
 */
export async function getCategories(): Promise<string[]> {
    const db = await getDb()
    const categories = await db.all<{ category: string }[]>(
        `SELECT DISTINCT category FROM articles ORDER BY category ASC`
    )
    return categories.map(c => c.category)
}

/**
 * Récupère les statistiques globales
 */
export async function getStats(): Promise<StatsResult> {
    const db = await getDb()
    const stats = await db.get<StatsResult>(`
    SELECT 
      COUNT(*) AS countArticles,
      COUNT(DISTINCT category) AS countCategories
    FROM articles
  `)

    return stats ?? { countArticles: 0, countCategories: 0 }
}

/**
 * Récupère les tendances (5 derniers articles par catégorie)
 */
export async function getTendances(): Promise<Article[]> {
    const db = await getDb()

    const tendances = await db.all<Article[]>(`
    SELECT *
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (PARTITION BY category ORDER BY published_at DESC) as row_num
      FROM articles
    )
    WHERE row_num <= 5
  `)

    return tendances
}

/**
 * Récupère les articles d'une catégorie par son slug
 */
export async function getArticlesBySlug(
    slug: string,
    limit: number = 20,
    page: number = 1
): Promise<ArticlesResult> {
    // Mapping slug -> nom de catégorie
    const categoryMap: Record<string, string> = {
        'technologie': 'Technologie',
        'economie': 'Economie',
        'environnement': 'Environnement',
        'sport': 'Sport',
        'sante': 'Santé',
        'actualites': 'Actualités',
    }

    const category = categoryMap[slug.toLowerCase()]

    if (!category) {
        return {
            articles: [],
            pagination: { page: 1, limit, total: 0, totalPages: 0 }
        }
    }

    return getArticles(category, limit, page)
}

/**
 * Mapping des slugs vers les noms de catégories
 */
export function getCategoryFromSlug(slug: string): string | null {
    const categoryMap: Record<string, string> = {
        'technologie': 'Technologie',
        'economie': 'Economie',
        'environnement': 'Environnement',
        'sport': 'Sport',
        'sante': 'Santé',
        'actualites': 'Actualités',
    }

    return categoryMap[slug.toLowerCase()] ?? null
}

/**
 * Mapping inverse: nom de catégorie -> slug
 */
export function getSlugFromCategory(category: string): string {
    const slugMap: Record<string, string> = {
        'Technologie': 'technologie',
        'Economie': 'economie',
        'Environnement': 'environnement',
        'Sport': 'sport',
        'Santé': 'sante',
        'Actualités': 'actualites',
    }

    return slugMap[category] ?? category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Récupère toutes les catégories avec leur slug
 */
export async function getCategoriesWithSlugs(): Promise<{ name: string; slug: string }[]> {
    const categories = await getCategories()
    return categories.map(cat => ({
        name: cat,
        slug: getSlugFromCategory(cat),
    }))
}