import { NextResponse } from 'next/server'
import { getStats } from '@/lib/db'
import { isValidLocale, i18nConfig, Locale } from '@/lib/i18n'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const langParam = searchParams.get('lang')

    const lang: Locale = langParam && isValidLocale(langParam) 
        ? langParam 
        : i18nConfig.defaultLocale

    try {
        const stats = await getStats(lang)
        return NextResponse.json(stats)
    } catch (error) {
        console.error('API stats error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
