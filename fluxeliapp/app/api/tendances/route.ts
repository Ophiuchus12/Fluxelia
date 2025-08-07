import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

async function openDb() {
    const dbPath = path.resolve(process.cwd(), '../rss_feed.db')
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    })
}

export async function GET(req: Request) {
    const db = await openDb()

    const tendances = await db.all(`
    SELECT *
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (PARTITION BY category ORDER BY published_at DESC) as row_num
      FROM articles
    )
    WHERE row_num <= 5
  `)

    return NextResponse.json(tendances)
}
