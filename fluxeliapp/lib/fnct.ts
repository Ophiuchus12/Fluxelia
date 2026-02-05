import { Article } from "@/types/article"
import { ArticlePage } from "@/types/articlePage"

// /lib/fnct.ts
export async function fetchArticle(
    category: string = '',
    limit: number = 20,
    page: number = 1
): Promise<ArticlePage> {
    const params = new URLSearchParams()
    if (category) params.set('categorie', category)
    if (limit) params.set('limit', limit.toString())
    if (page) params.set('page', page.toString())

    const res = await fetch(`/api/articles?${params.toString()}`)

    if (!res.ok) throw new Error('Erreur de chargement des articles')
    return await res.json()
}

export async function fetchTendancesArticles(): Promise<Article[]> {
    const res = await fetch('/api/articles/tendances');
    if (!res.ok) throw new Error('Erreur de chargement des tendances');

    const { tendances } = await res.json();
    console.log('Tendances:', tendances);
    return tendances || [];
}

export async function fetchStats(): Promise<{ countArticles: number; countCategories: number }> {
    const res = await fetch('/api/articles/stats');
    if (!res.ok) throw new Error('Erreur de chargement des statistiques');

    return await res.json();
}

export async function fetchCategories(): Promise<string[]> {
    const res = await fetch('/api/articles/categories');
    if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
    return await res.json();
}


export async function fetchSources(): Promise<{ sources: number; categories: number }> {
    const res = await fetch('/api/sources')
    if (!res.ok) throw new Error('Erreur de chargement des sources')
    return await res.json()
}

// ========== NOUVELLE FONCTION RECHERCHE ==========

export interface SearchResult {
    articles: Article[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    query: string
}

export async function fetchSearch(
    query: string,
    category: string = '',
    limit: number = 20,
    page: number = 1
): Promise<SearchResult> {
    const params = new URLSearchParams()
    params.set('q', query)
    if (category && category !== 'Toutes') params.set('categorie', category)
    params.set('limit', limit.toString())
    params.set('page', page.toString())

    const res = await fetch(`/api/articles/search?${params.toString()}`)

    if (!res.ok) throw new Error('Erreur de recherche')
    return await res.json()
}