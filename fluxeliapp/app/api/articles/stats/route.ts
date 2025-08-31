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
  const db = await openDb();

  const stats = await db.get(`
    SELECT 
      COUNT(*) AS countArticles,
      COUNT(DISTINCT category) AS countCategories
    FROM articles
  `);

  return NextResponse.json(stats);
}
