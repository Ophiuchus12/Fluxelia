import Database from 'better-sqlite3';
import path from 'path';

export async function GET() {
    const dbPath = path.resolve(process.cwd(), '../rss_feed.db');
    const db = new Database(dbPath);

    const articles = db.prepare(`
    SELECT title, url, short_description, published_at, category
    FROM articles
    ORDER BY published_at DESC
    LIMIT 20
  `).all();

    return Response.json(articles);
}
