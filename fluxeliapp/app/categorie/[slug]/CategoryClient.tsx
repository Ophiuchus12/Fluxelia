'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { ArticleCard } from '@/app/components/ArticleCard'
import { Article } from '@/types/article'
import { Grid, List, TrendingUp, Globe } from 'lucide-react'
import { Locale, getAllCategories, getLocalizedPath } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'

interface CategoryClientProps {
    locale: Locale
    categoryName: string
    categorySlug: string
    categoryEmoji: string
    categoryDescription: string
    initialArticles: Article[]
    initialPagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export function CategoryClient({
    locale,
    categoryName,
    categorySlug,
    categoryEmoji,
    categoryDescription,
    initialArticles,
    initialPagination,
}: CategoryClientProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Utiliser directement les props serveur (pas de useState pour éviter le stale state)
    const articles = initialArticles
    const page = initialPagination.page
    const totalPages = initialPagination.totalPages
    const total = initialPagination.total

    const t = getTranslations(locale)
    const categories = getAllCategories(locale)
    const currentPath = getLocalizedPath(`/categorie/${categorySlug}`, locale)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Header locale={locale} currentPath={currentPath} />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
                    <Link href={getLocalizedPath('/', locale)} className="text-gray-400 hover:text-cyan-400">
                        {t.breadcrumbs.home}
                    </Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-cyan-400">{categoryName}</span>
                </nav>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="text-5xl" role="img" aria-label={categoryName}>
                            {categoryEmoji}
                        </span>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                    {categoryName}
                                </span>
                            </h1>
                            <p className="text-gray-400 mt-2 max-w-2xl">
                                {categoryDescription}
                            </p>
                        </div>
                    </div>

                    {/* Stats & controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-bold">{total}</span>
                            <span className="text-gray-400 text-sm">articles</span>
                        </div>

                        <div className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Articles */}
                <section aria-label={`Articles ${categoryName}`}>
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                        {articles.map((article, index) => (
                            <ArticleCard
                                key={`${article.url}-${index}`}
                                article={article}
                                viewMode={viewMode}
                                locale={locale}
                            />
                        ))}
                    </div>
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Pagination" className="mt-16 flex justify-center">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-2">
                            <div className="flex items-center space-x-1">
                                <Link
                                    href={page > 1 ? `${currentPath}?page=${page - 1}` : '#'}
                                    className={`px-4 py-3 rounded-xl font-medium text-sm ${page === 1 ? 'text-gray-600 pointer-events-none' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
                                >
                                    {t.pagination.previous}
                                </Link>

                                <div className="flex items-center space-x-1 px-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number
                                        if (totalPages <= 5) pageNum = i + 1
                                        else if (page <= 3) pageNum = i + 1
                                        else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                                        else pageNum = page - 2 + i

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={`${currentPath}?page=${pageNum}`}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm ${pageNum === page
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        )
                                    })}
                                </div>

                                <Link
                                    href={page < totalPages ? `${currentPath}?page=${page + 1}` : '#'}
                                    className={`px-4 py-3 rounded-xl font-medium text-sm ${page === totalPages ? 'text-gray-600 pointer-events-none' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
                                >
                                    {t.pagination.next}
                                </Link>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Other categories */}
                <section className="mt-16">
                    <h2 className="text-xl font-bold text-white mb-6">
                        {locale === 'fr' ? 'Explorer d\'autres catégories' : 'Explore other categories'}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {categories
                            .filter((cat) => cat.slug !== categorySlug)
                            .map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={getLocalizedPath(`/categorie/${cat.slug}`, locale)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/50 rounded-xl transition-all"
                                >
                                    <span>{cat.emoji}</span>
                                    <span className="text-gray-300 hover:text-white">{cat.name}</span>
                                </Link>
                            ))}
                    </div>
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    )
}