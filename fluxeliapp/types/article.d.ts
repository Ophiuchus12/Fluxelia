export interface Article {
    id: number
    title: string
    url: string
    short_description: string
    published_at: string
    category: string
    category_slug: string
    lang: 'fr' | 'en'
}