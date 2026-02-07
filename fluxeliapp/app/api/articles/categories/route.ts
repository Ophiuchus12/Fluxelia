import { NextResponse } from 'next/server'
import { getCategories, getCategoriesWithSlugs } from '@/lib/db'
import { isValidLocale, i18nConfig, Locale } from '@/lib/i18n'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const langParam = searchParams.get('lang')
    const withSlugs = searchParams.get('withSlugs') === 'true'

    const lang: Locale = langParam && isValidLocale(langParam) 
        ? langParam 
        : i18nConfig.defaultLocale

    try {
        if (withSlugs) {
            const categories = await getCategoriesWithSlugs(lang)
            return NextResponse.json(categories)
        } else {
            const categories = await getCategories(lang)
            return NextResponse.json(categories)
        }
    } catch (error) {
        console.error('API categories error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
