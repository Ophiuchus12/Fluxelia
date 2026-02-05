'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { ArticleCard } from '@/app/components/ArticleCard'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'
import { Article } from '@/types/article'
import { Grid, List, TrendingUp, Globe } from 'lucide-react'

interface CategoryClientProps {
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
    categoryName,
    categorySlug,
    categoryEmoji,
    categoryDescription,
    initialArticles,
    initialPagination,
}: CategoryClientProps) {
    const [articles] = useState<Article[]>(initialArticles)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [page] = useState(initialPagination.page)
    const [totalPages] = useState(initialPagination.totalPages)
    const [total] = useState(initialPagination.total)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Effet de particules */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <Header />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Fil d'Ariane */}
                <Breadcrumbs
                    items={[
                        { label: 'Catégories', href: '/' },
                        { label: categoryName },
                    ]}
                    className="mb-8"
                />

                {/* En-tête de catégorie */}
                <header className="mb-12">
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="text-5xl" role="img" aria-label={categoryName}>
                            {categoryEmoji}
                        </span>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white">
                                Actualités{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                    {categoryName}
                                </span>
                            </h1>
                            <p className="text-gray-400 mt-2 max-w-2xl">
                                {categoryDescription}
                            </p>
                        </div>
                    </div>

                    {/* Stats et contrôles */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                <TrendingUp className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                                <span className="text-white font-bold">{total}</span>
                                <span className="text-gray-400 text-sm">articles</span>
                            </div>
                        </div>

                        {/* Mode d'affichage */}
                        <div className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                title="Vue en grille"
                                aria-pressed={viewMode === 'grid'}
                            >
                                <Grid className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                title="Vue en liste"
                                aria-pressed={viewMode === 'list'}
                            >
                                <List className="w-4 h-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Grille d'articles */}
                <section aria-label={`Articles ${categoryName}`}>
                    <div
                        className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 max-w-4xl mx-auto'
                            }`}
                    >
                        {articles.map((article, index) => (
                            <ArticleCard
                                key={`${article.url}-${index}`}
                                article={article}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Pagination" className="mt-16 flex justify-center">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-2">
                            <div className="flex items-center space-x-1">
                                {/* Précédent */}
                                <Link
                                    href={page > 1 ? `/categorie/${categorySlug}?page=${page - 1}` : '#'}
                                    aria-label="Page précédente"
                                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all ${page === 1
                                        ? 'text-gray-600 cursor-not-allowed opacity-50 pointer-events-none'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Précédent
                                </Link>

                                {/* Pages */}
                                <div className="flex items-center space-x-1 px-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (page <= 3) {
                                            pageNum = i + 1
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = page - 2 + i
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={`/categorie/${categorySlug}?page=${pageNum}`}
                                                aria-label={`Page ${pageNum}`}
                                                aria-current={pageNum === page ? 'page' : undefined}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${pageNum === page
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        )
                                    })}
                                </div>

                                {/* Suivant */}
                                <Link
                                    href={page < totalPages ? `/categorie/${categorySlug}?page=${page + 1}` : '#'}
                                    aria-label="Page suivante"
                                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all ${page === totalPages
                                        ? 'text-gray-600 cursor-not-allowed opacity-50 pointer-events-none'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                >
                                    Suivant
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Indicateur de page */}
                        <div className="ml-6 flex items-center">
                            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 px-4 py-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-400">Page</span>
                                    <span className="text-white font-bold">{page}</span>
                                    <span className="text-gray-500">sur</span>
                                    <span className="text-cyan-400 font-bold">{totalPages}</span>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Autres catégories */}
                <section className="mt-16" aria-labelledby="other-categories">
                    <h2 id="other-categories" className="text-xl font-bold text-white mb-6">
                        Explorer d'autres catégories
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { slug: 'technologie', name: 'Technologie', emoji: '💻' },
                            { slug: 'economie', name: 'Économie', emoji: '📈' },
                            { slug: 'environnement', name: 'Environnement', emoji: '🌱' },
                            { slug: 'sport', name: 'Sport', emoji: '⚽' },
                            { slug: 'sante', name: 'Santé', emoji: '🏥' },
                            { slug: 'actualites', name: 'Actualités', emoji: '📰' },
                        ]
                            .filter((cat) => cat.slug !== categorySlug)
                            .map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/categorie/${cat.slug}`}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/50 rounded-xl transition-all"
                                >
                                    <span>{cat.emoji}</span>
                                    <span className="text-gray-300 hover:text-white">{cat.name}</span>
                                </Link>
                            ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-4 h-4 text-white" aria-hidden="true" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Fluxelia
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Votre agrégateur d'actualités intelligent.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
