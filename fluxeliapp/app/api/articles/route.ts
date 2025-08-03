import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'  // oublie pas d'importer path

// 📦 connexion à SQLite
async function openDb() {
    const dbPath = path.resolve(process.cwd(), '../rss_feed.db')  // chemin correct
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    })
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const categorie = searchParams.get('categorie') || null
    const nbShownParam = searchParams.get('nbShown')
    const nbShown = nbShownParam ? parseInt(nbShownParam) : 1000

    const db = await openDb()

    let articles
    if (categorie) {
        articles = await db.all(
            `SELECT * FROM articles WHERE category = ? ORDER BY published_at DESC LIMIT ?`,
            [categorie, nbShown]
        )
    } else {
        articles = await db.all(
            `SELECT * FROM articles ORDER BY published_at DESC LIMIT ?`,
            [nbShown]
        )
    }

    return NextResponse.json(articles)
}