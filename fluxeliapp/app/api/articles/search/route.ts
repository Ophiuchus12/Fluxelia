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
  const { searchParams } = new URL(req.url)
  
  const query = searchParams.get('q')?.trim() || ''
  const categorie = searchParams.get('categorie') || null
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')
  
  const page = pageParam ? parseInt(pageParam, 10) : 1
  const limit = limitParam ? parseInt(limitParam, 10) : 20
  const offset = (page - 1) * limit
  
  // Si pas de recherche, retourner vide
  if (!query || query.length < 2) {
    return NextResponse.json({
      articles: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },
      query: '',
    })
  }
  
  const db = await openDb()
  
  // Préparer le terme de recherche pour LIKE
  const searchTerm = `%${query}%`
  
  let articles
  let totalCount
  
  if (categorie && categorie !== 'Toutes') {
    // Recherche avec filtre catégorie
    articles = await db.all(
      `SELECT * FROM articles 
       WHERE (title LIKE ? OR short_description LIKE ?)
       AND category = ?
       ORDER BY published_at DESC 
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, categorie, limit, offset]
    )
    
    const count = await db.get(
      `SELECT COUNT(*) as count FROM articles 
       WHERE (title LIKE ? OR short_description LIKE ?)
       AND category = ?`,
      [searchTerm, searchTerm, categorie]
    )
    totalCount = count?.count || 0
  } else {
    // Recherche globale
    articles = await db.all(
      `SELECT * FROM articles 
       WHERE title LIKE ? OR short_description LIKE ?
       ORDER BY published_at DESC 
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, limit, offset]
    )
    
    const count = await db.get(
      `SELECT COUNT(*) as count FROM articles 
       WHERE title LIKE ? OR short_description LIKE ?`,
      [searchTerm, searchTerm]
    )
    totalCount = count?.count || 0
  }
  
  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
    query,
  })
}
