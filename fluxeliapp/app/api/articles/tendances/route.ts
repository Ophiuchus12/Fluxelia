import { NextResponse } from 'next/server'
import { getTendances } from '@/lib/db'
import { isValidLocale, i18nConfig, Locale } from '@/lib/i18n'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const langParam = searchParams.get('lang')

    const lang: Locale = langParam && isValidLocale(langParam) 
        ? langParam 
        : i18nConfig.defaultLocale

    try {
        const tendances = await getTendances(lang)
        return NextResponse.json({ tendances })
    } catch (error) {
        console.error('API tendances error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
