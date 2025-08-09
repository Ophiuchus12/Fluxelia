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
