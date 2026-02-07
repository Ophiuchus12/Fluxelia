'use client'

import { Search, Globe, TrendingUp, Zap, Grid, List, Filter, Loader } from 'lucide-react'
import { useState } from 'react'
import { ArticleCard } from './components/ArticleCard'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Article } from '@/types/article'
import { Locale, getAllCategories, getLocalizedPath } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'

interface HomeClientProps {
    locale: Locale
    initialArticles: Article[]
    initialCategories: string[]
    initialStats: { countArticles: number; countCategories: number }
    initialPagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export function HomeClient({
    locale,
    initialArticles,
    initialCategories,
    initialStats,
    initialPagination,
}: HomeClientProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(initialPagination.page)
    const [totalPages, setTotalPages] = useState(initialPagination.totalPages)

    const t = getTranslations(locale)
    const categories = getAllCategories(locale)
    const limit = 20

    // Charger les articles avec filtre catégorie
    async function loadArticles(categorySlug: string | null, pageToLoad: number = 1) {
        try {
            setLoading(true)
            setError(null)

            const params = new URLSearchParams()
            if (categorySlug) params.set('category', categorySlug)
            params.set('limit', limit.toString())
            params.set('page', pageToLoad.toString())
            params.set('lang', locale)

            const res = await fetch(`/api/articles?${params.toString()}`)
            if (!res.ok) throw new Error('Erreur de chargement')

            const data = await res.json()
            setArticles(data.articles)
            setPage(pageToLoad)
            setTotalPages(data.pagination.totalPages)
        } catch (err) {
            setError(t.home.loadError)
            console.error('Erreur:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryChange = async (slug: string | null) => {
        setSelectedCategory(slug)
        await loadArticles(slug, 1)
    }

    const handlePageChange = async (newPage: number) => {
        await loadArticles(selectedCategory, newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <Header locale={locale} currentPath="/" />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Hero */}
                <header className="text-center mb-16 relative">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2" aria-hidden="true" />
                        <span className="text-cyan-400 text-sm font-bold">{t.home.badge}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        <span className="text-white">{t.home.title}</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                            {t.home.titleHighlight}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        {t.home.subtitle}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">
                            {' '}{t.home.subtitleBrand}
                        </span>
                        {' '}{t.home.subtitleEnd}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12" role="list">
                        {[
                            { label: t.home.stats.sources, value: '10+', icon: <Globe className="w-5 h-5" /> },
                            { label: t.home.stats.live, value: t.home.stats.liveValue, icon: <Zap className="w-5 h-5" /> },
                            { label: t.home.stats.articles, value: initialStats.countArticles, icon: <TrendingUp className="w-5 h-5" /> },
                        ].map((stat, index) => (
                            <div key={index} className="flex items-center space-x-3 px-4 py-2 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
                                <div className="text-cyan-400">{stat.icon}</div>
                                <div>
                                    <div className="text-white font-bold">{stat.value}</div>
                                    <div className="text-gray-400 text-xs">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Filters */}
                <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                {loading ? (
                                    <Loader className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                                ) : (
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                )}
                                <select
                                    className="pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none appearance-none min-w-[180px]"
                                    value={selectedCategory ?? ''}
                                    onChange={(e) => handleCategoryChange(e.target.value || null)}
                                    disabled={loading}
                                >
                                    <option value="">{t.home.allCategories}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.slug} value={cat.slug}>
                                            {cat.emoji} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-sm text-gray-500">
                                {categories.length} {t.home.categoriesAvailable}
                            </span>
                        </div>

                        {/* View mode */}
                        <div className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                disabled={loading}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                disabled={loading}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 mb-6" role="alert">
                        <div className="flex items-center">
                            <div className="text-red-400 mr-3">⚠️</div>
                            <p className="text-red-200">{error}</p>
                            <button
                                onClick={() => loadArticles(selectedCategory, page)}
                                className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                            >
                                {t.home.retry}
                            </button>
                        </div>
                    </div>
                )}

                {/* Category indicator */}
                {selectedCategory && (
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{t.home.filteredBy}</span>
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full border border-cyan-500/30">
                                {categories.find(c => c.slug === selectedCategory)?.name}
                            </span>
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className="text-sm text-gray-400 hover:text-cyan-400 underline"
                            >
                                {t.home.viewAll}
                            </button>
                        </div>
                    </div>
                )}

                {/* Articles grid */}
                <section aria-label="Articles" aria-busy={loading}>
                    {loading ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                                    <div className="animate-pulse">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-4 bg-gray-700 rounded w-20" />
                                            <div className="h-4 bg-gray-700 rounded w-16" />
                                        </div>
                                        <div className="h-6 bg-gray-700 rounded mb-3" />
                                        <div className="h-4 bg-gray-700 rounded mb-2" />
                                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
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
                    )}
                </section>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <nav aria-label="Pagination" className="mt-16 flex justify-center">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-2">
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm ${page === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
                                >
                                    {t.pagination.previous}
                                </button>

                                <div className="flex items-center space-x-1 px-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number
                                        if (totalPages <= 5) pageNum = i + 1
                                        else if (page <= 3) pageNum = i + 1
                                        else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                                        else pageNum = page - 2 + i

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-xl font-bold text-sm ${pageNum === page
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm ${page === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
                                >
                                    {t.pagination.next}
                                </button>
                            </div>
                        </div>

                        <div className="ml-6 flex items-center">
                            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 px-4 py-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-400">{t.pagination.page}</span>
                                    <span className="text-white font-bold">{page}</span>
                                    <span className="text-gray-500">{t.pagination.of}</span>
                                    <span className="text-cyan-400 font-bold">{totalPages}</span>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}

                {/* No articles */}
                {!loading && articles.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">{t.home.noArticles}</h2>
                        <p className="text-gray-500 mb-4">
                            {selectedCategory ? t.home.noArticlesCategory : t.home.noArticlesGeneral}
                        </p>
                        {selectedCategory && (
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                            >
                                {t.home.viewAllArticles}
                            </button>
                        )}
                    </div>
                )}
            </main>

            <Footer locale={locale} />
        </div>
    )
}
