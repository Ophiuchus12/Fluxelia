
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
    const db = await openDb();
    const categories = await db.all(`SELECT DISTINCT category FROM articles ORDER BY category ASC`);
    return NextResponse.json(categories.map(c => c.category));
}
