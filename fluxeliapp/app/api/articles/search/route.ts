import { NextResponse } from 'next/server'
import { searchArticles } from '@/lib/db'
import { isValidLocale, i18nConfig, Locale } from '@/lib/i18n'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)

    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || null
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const langParam = searchParams.get('lang')

    const page = pageParam ? parseInt(pageParam, 10) : 1
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const lang: Locale = langParam && isValidLocale(langParam) 
        ? langParam 
        : i18nConfig.defaultLocale

    if (!query || query.length < 2) {
        return NextResponse.json({
            articles: [],
            pagination: { page: 1, limit, total: 0, totalPages: 0 }
        })
    }

    try {
        const result = await searchArticles(query, category, limit, page, lang)
        return NextResponse.json(result)
    } catch (error) {
        console.error('API search error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
