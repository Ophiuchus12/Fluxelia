'use client'
import { useEffect, useState } from 'react'
import { fetchArticle } from '@/lib/fnct'
import { ArticleCard } from './components/ArticleCard'
import { CategoryFilter } from './components/CategoryFilter'
import { Article } from '@/types/article'

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCat, setSelectedCat] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  async function loadArticles(category = '') {
    const res = (await fetchArticle(category)) as Article[]
    setArticles(res)
  }

  async function loadCategories() {
    const res = (await fetchArticle()) as Article[]
    const uniqueCats = [...new Set(res.map((a) => a.category))] as string[]
    setCategories(uniqueCats)
  }

  useEffect(() => {
    loadCategories()
    loadArticles()
  }, [])

  useEffect(() => {
    loadArticles(selectedCat)
  }, [selectedCat])

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">📰 Articles récents</h1>
      <CategoryFilter selected={selectedCat} onChange={setSelectedCat} categories={categories} />
      {articles.map((article) => (
        <ArticleCard key={article.url} article={article} />
      ))}
    </>
  )
}

