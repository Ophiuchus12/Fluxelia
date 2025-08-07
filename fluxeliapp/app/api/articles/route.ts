import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

async function openDb() {
    const dbPath = path.resolve(process.cwd(), '../rss_feed.db') // adapté pour Next.js
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    })
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)

    const categorie = searchParams.get('categorie') || null
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')

    const page = pageParam ? parseInt(pageParam, 10) : 1
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const offset = (page - 1) * limit

    const db = await openDb()

    let articles
    let totalCount

    if (categorie && categorie !== 'Toutes') {
        articles = await db.all(
            `SELECT * FROM articles WHERE category = ? ORDER BY published_at DESC LIMIT ? OFFSET ?`,
            [categorie, limit, offset]
        )

        const count = await db.get(
            `SELECT COUNT(*) as count FROM articles WHERE category = ?`,
            [categorie]
        )
        totalCount = count.count
    } else {
        articles = await db.all(
            `SELECT * FROM articles ORDER BY published_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )

        const count = await db.get(`SELECT COUNT(*) as count FROM articles`)
        totalCount = count.count
    }

    return NextResponse.json({
        articles,
        pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    })
}
