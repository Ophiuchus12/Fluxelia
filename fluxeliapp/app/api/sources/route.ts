import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
    try {
        // Chemin vers flux.json
        const fluxPath = path.resolve(process.cwd(), '../scraper/flux.json')

        const fileContent = fs.readFileSync(fluxPath, 'utf-8')
        const fluxData = JSON.parse(fileContent)

        // Compte le nombre total de feeds et catégories
        let totalFeeds = 0
        let categories = 0

        for (const item of fluxData) {
            if (item.feeds && Array.isArray(item.feeds)) {
                totalFeeds += item.feeds.length
                categories++
            }
        }

        return NextResponse.json({
            sources: totalFeeds,
            categories: categories
        })
    } catch (error) {
        console.error('Erreur lecture flux.json:', error)
        // Fallback en cas d'erreur
        return NextResponse.json({ sources: 7, categories: 6 })
    }
}