'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { ArticleCard } from '@/app/components/ArticleCard'
import { Article } from '@/types/article'
import { Search, Filter, Grid, List, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Locale, getAllCategories, getLocalizedPath } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'

interface SearchPageContentProps {
    locale: Locale
}

function SearchPageContent({ locale }: SearchPageContentProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const t = getTranslations(locale)
    const categories = getAllCategories(locale)

    const initialQuery = searchParams.get('q') || ''
    const initialCategory = searchParams.get('category') || ''
    const initialPage = parseInt(searchParams.get('page') || '1', 10)

    const [query, setQuery] = useState(initialQuery)
    const [searchInput, setSearchInput] = useState(initialQuery)
    const [articles, setArticles] = useState<Article[]>([])
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [searchTime, setSearchTime] = useState(0)
    const [hasSearched, setHasSearched] = useState(false)

    const limit = 20
    const currentPath = getLocalizedPath('/recherche', locale)

    // Effectuer la recherche
    const performSearch = useCallback(async (searchQuery: string, categorySlug: string, pageNum: number) => {
        if (!searchQuery || searchQuery.length < 2) {
            setArticles([])
            setTotalResults(0)
            setHasSearched(false)
            return
        }

        setLoading(true)
        const startTime = performance.now()

        try {
            const params = new URLSearchParams()
            params.set('q', searchQuery)
            params.set('lang', locale)
            params.set('limit', limit.toString())
            params.set('page', pageNum.toString())
            if (categorySlug) params.set('category', categorySlug)

            const res = await fetch(`/api/articles/search?${params.toString()}`)
            if (!res.ok) throw new Error('Erreur de recherche')

            const result = await res.json()

            setArticles(result.articles)
            setTotalResults(result.pagination.total)
            setTotalPages(result.pagination.totalPages)
            setPage(pageNum)
            setSearchTime(Math.round(performance.now() - startTime))
            setHasSearched(true)

            // Mettre à jour l'URL
            const urlParams = new URLSearchParams()
            urlParams.set('q', searchQuery)
            if (categorySlug) urlParams.set('category', categorySlug)
            if (pageNum > 1) urlParams.set('page', pageNum.toString())

            router.replace(`${currentPath}?${urlParams.toString()}`, { scroll: false })
        } catch (error) {
            console.error('Erreur recherche:', error)
        } finally {
            setLoading(false)
        }
    }, [locale, router, currentPath])

    // Recherche initiale si query dans l'URL
    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery)
            setSearchInput(initialQuery)
            performSearch(initialQuery, initialCategory, initialPage)
        }
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchInput.trim().length >= 2) {
            setQuery(searchInput.trim())
            setPage(1)
            performSearch(searchInput.trim(), selectedCategory, 1)
        }
    }

    const handleCategoryChange = (newCategory: string) => {
        setSelectedCategory(newCategory)
        if (query.length >= 2) {
            setPage(1)
            performSearch(query, newCategory, 1)
        }
    }

    const handlePageChange = (newPage: number) => {
        performSearch(query, selectedCategory, newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const suggestions = locale === 'fr'
        ? ['Intelligence artificielle', 'Climat', 'Économie', 'Sport', 'Santé']
        : ['Artificial intelligence', 'Climate', 'Economy', 'Sports', 'Health']

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Header locale={locale} currentPath={currentPath} />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                            <Search className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{t.search.title}</h1>
                            <p className="text-gray-400">{t.search.subtitle}</p>
                        </div>
                    </div>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="max-w-3xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder={t.search.placeholder}
                                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                autoFocus={!initialQuery}
                            />
                        </div>
                    </form>
                </header>

                {/* Filters */}
                {hasSearched && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="pl-10 pr-8 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">{locale === 'fr' ? 'Toutes les catégories' : 'All categories'}</option>
                                        {categories.map((cat) => (
                                            <option key={cat.slug} value={cat.slug}>
                                                {cat.emoji} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span className="flex items-center space-x-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>
                                            <strong className="text-white">{totalResults}</strong>{' '}
                                            {totalResults > 1 ? t.search.resultsPlural : t.search.results}
                                        </span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{searchTime}ms</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-all ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-all ${viewMode === 'list'
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial state */}
                {!hasSearched && !loading && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                            <Search className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t.search.startSearch}</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">{t.search.startSearchDesc}</p>

                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="text-sm text-gray-500">{t.search.suggestions}</span>
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => {
                                        setSearchInput(suggestion)
                                        setQuery(suggestion)
                                        performSearch(suggestion, selectedCategory, 1)
                                    }}
                                    className="px-3 py-1 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/50 rounded-full text-sm text-gray-300 hover:text-white transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 animate-pulse">
                                <div className="h-4 bg-gray-700 rounded w-20 mb-4" />
                                <div className="h-6 bg-gray-700 rounded mb-3" />
                                <div className="h-4 bg-gray-700 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Results */}
                {!loading && hasSearched && articles.length > 0 && (
                    <>
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 max-w-4xl mx-auto'
                        }`}>
                            {articles.map((article, index) => (
                                <ArticleCard
                                    key={`${article.url}-${index}`}
                                    article={article}
                                    viewMode={viewMode}
                                    locale={locale}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="mt-12 flex justify-center">
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-2">
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${page === 1
                                                ? 'text-gray-600 cursor-not-allowed'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                            }`}
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
                                                        className={`w-10 h-10 rounded-lg font-bold text-sm ${pageNum === page
                                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
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
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${page === totalPages
                                                ? 'text-gray-600 cursor-not-allowed'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                            }`}
                                        >
                                            {t.pagination.next}
                                        </button>
                                    </div>
                                </div>
                            </nav>
                        )}
                    </>
                )}

                {/* No results */}
                {!loading && hasSearched && articles.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t.search.noResults}</h2>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            {t.search.noResultsFor} "<span className="text-cyan-400">{query}</span>"
                            {selectedCategory && ` ${t.search.inCategory} ${categories.find(c => c.slug === selectedCategory)?.name}`}.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700"
                            >
                                {t.search.searchAllCategories}
                            </button>
                            <Link
                                href={getLocalizedPath('/', locale)}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                            >
                                {t.search.backHome}
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <Footer locale={locale} />
        </div>
    )
}

// Export pour FR
export function SearchPageFR() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
            </div>
        }>
            <SearchPageContent locale="fr" />
        </Suspense>
    )
}

// Export pour EN
export function SearchPageEN() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
            </div>
        }>
            <SearchPageContent locale="en" />
        </Suspense>
    )
}
