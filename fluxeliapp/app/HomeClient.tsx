'use client'

import { Search, Globe, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ArticleCard } from './components/ArticleCard'
import { Header } from './components/Header'
import { SearchAndFilter } from './components/SearchAndFilter'
import { Article } from '@/types/article'

interface HomeClientProps {
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
    initialArticles,
    initialCategories,
    initialStats,
    initialPagination
}: HomeClientProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles)
    const [categories] = useState<string[]>(['Toutes', ...initialCategories])
    const [selectedCategory, setSelectedCategory] = useState('Toutes')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [stats] = useState(initialStats)

    const [page, setPage] = useState(initialPagination.page)
    const [totalPages, setTotalPages] = useState(initialPagination.totalPages)
    const limit = 20

    // En haut du composant, ajoute le state
    const [sourcesCount, setSourcesCount] = useState(7) // Valeur par défaut

    // Ajoute ce useEffect
    useEffect(() => {
        async function fetchSources() {
            try {
                const res = await fetch('/api/sources')
                const data = await res.json()
                setSourcesCount(data.sources)
            } catch (error) {
                console.error('Erreur:', error)
            }
        }
        fetchSources()
    }, [])

    // Fonction pour charger les articles d'une catégorie spécifique
    async function loadArticlesByCategory(category: string, pageToLoad: number = 1) {
        try {
            setLoading(true)
            setError(null)

            const params = new URLSearchParams()
            if (category && category !== 'Toutes') params.set('categorie', category)
            params.set('limit', limit.toString())
            params.set('page', pageToLoad.toString())

            const res = await fetch(`/api/articles?${params.toString()}`)
            if (!res.ok) throw new Error('Erreur de chargement')

            const data = await res.json()

            setArticles(data.articles)
            setPage(pageToLoad)
            setTotalPages(data.pagination.totalPages)
        } catch (err) {
            setError('Erreur lors du chargement des articles')
            console.error('Erreur:', err)
        } finally {
            setLoading(false)
        }
    }

    // Gestionnaire de changement de catégorie
    const handleCategoryChange = async (newCategory: string) => {
        setSelectedCategory(newCategory)
        await loadArticlesByCategory(newCategory, 1)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Effet de particules d'arrière-plan */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <Header />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Section hero futuriste */}
                <header className="text-center mb-16 relative">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2" aria-hidden="true" />
                        <span className="text-cyan-400 text-sm font-bold">L'INFORMATION AUGMENTÉE</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        <span className="text-white">Flux</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">elia</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Transcendez l'actualité. Explorez
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold"> Fluxelia</span>
                        {" "}qui révolutionne votre façon de consommer l'information.
                    </p>

                    {/* Stats en temps réel */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12" role="list" aria-label="Statistiques du site">
                        {[
                            { label: "Sources actives", value: sourcesCount, icon: <Globe className="w-5 h-5" aria-hidden="true" /> },
                            { label: "Informations", value: "Live", icon: <Zap className="w-5 h-5" aria-hidden="true" /> },
                            { label: "Nombre d'articles", value: stats?.countArticles || 0, icon: <TrendingUp className="w-5 h-5" aria-hidden="true" /> }
                        ].map((stat, index) => (
                            <div key={index} role="listitem" className="flex items-center space-x-3 px-4 py-2 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
                                <div className="text-cyan-400">{stat.icon}</div>
                                <div>
                                    <div className="text-white font-bold">{stat.value}</div>
                                    <div className="text-gray-400 text-xs">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Recherche et filtres */}
                <SearchAndFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    categories={categories}
                    loading={loading}
                />

                {/* Gestion des erreurs */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 mb-6" role="alert">
                        <div className="flex items-center">
                            <div className="text-red-400 mr-3">⚠️</div>
                            <div>
                                <p className="text-red-200 font-medium">Erreur de chargement</p>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                            <button
                                onClick={() => loadArticlesByCategory(selectedCategory)}
                                className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                )}

                {/* Indicateur de catégorie */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {selectedCategory && (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500">•</span>
                                <span className="text-cyan-400 font-medium">#{selectedCategory}</span>
                            </div>
                        )}
                    </div>

                    {selectedCategory && selectedCategory !== 'Toutes' && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Filtré par:</span>
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full border border-cyan-500/30">
                                {selectedCategory}
                            </span>
                            <button
                                onClick={() => handleCategoryChange('Toutes')}
                                className="text-sm text-gray-400 hover:text-cyan-400 underline"
                            >
                                Voir tout
                            </button>
                        </div>
                    )}
                </div>

                {/* Grille d'articles */}
                <section aria-label="Liste des articles" aria-busy={loading}>
                    {loading ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                                    <div className="animate-pulse">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-4 bg-gray-700 rounded w-20"></div>
                                            <div className="h-4 bg-gray-700 rounded w-16"></div>
                                        </div>
                                        <div className="h-6 bg-gray-700 rounded mb-3"></div>
                                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
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
                                    onClick={() => loadArticlesByCategory(selectedCategory, page - 1)}
                                    disabled={page === 1}
                                    aria-label="Page précédente"
                                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${page === 1
                                        ? 'text-gray-600 cursor-not-allowed opacity-50'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Précédent
                                </button>

                                <div className="flex items-center space-x-1 px-2">
                                    {(() => {
                                        const getVisiblePages = () => {
                                            if (totalPages <= 6) {
                                                return Array.from({ length: totalPages }, (_, i) => i + 1)
                                            }

                                            const pages: (number | string)[] = [1]

                                            if (page <= 4) {
                                                pages.push(2, 3, 4, 5)
                                                if (totalPages > 6) pages.push('ellipsis1')
                                                pages.push(totalPages)
                                            } else if (page >= totalPages - 3) {
                                                if (totalPages > 6) pages.push('ellipsis1')
                                                pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
                                            } else {
                                                pages.push('ellipsis1')
                                                pages.push(page - 1, page, page + 1)
                                                pages.push('ellipsis2')
                                                pages.push(totalPages)
                                            }

                                            return pages
                                        }

                                        return getVisiblePages().map((p) => {
                                            if (typeof p === 'string') {
                                                return (
                                                    <span key={p} className="px-2 py-2 text-gray-500 text-sm" aria-hidden="true">
                                                        ...
                                                    </span>
                                                )
                                            }

                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => loadArticlesByCategory(selectedCategory, p)}
                                                    aria-label={`Page ${p}`}
                                                    aria-current={p === page ? 'page' : undefined}
                                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${p === page
                                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 scale-110'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        })
                                    })()}
                                </div>

                                <button
                                    onClick={() => loadArticlesByCategory(selectedCategory, page + 1)}
                                    disabled={page === totalPages}
                                    aria-label="Page suivante"
                                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${page === totalPages
                                        ? 'text-gray-600 cursor-not-allowed opacity-50'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                >
                                    Suivant
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="ml-6 flex items-center">
                            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 px-4 py-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true"></div>
                                    <span className="text-gray-400">Page</span>
                                    <span className="text-white font-bold">{page}</span>
                                    <span className="text-gray-500">sur</span>
                                    <span className="text-cyan-400 font-bold">{totalPages}</span>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Message si aucun article */}
                {!loading && articles.length === 0 && !error && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">
                            <Search className="w-16 h-16 mx-auto" aria-hidden="true" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">
                            Aucun article trouvé
                        </h2>
                        <p className="text-gray-500 mb-4">
                            {selectedCategory && selectedCategory !== 'Toutes'
                                ? `Aucun article disponible dans la catégorie "${selectedCategory}".`
                                : 'Aucun article disponible pour le moment.'
                            }
                        </p>
                        {selectedCategory && selectedCategory !== 'Toutes' && (
                            <button
                                onClick={() => handleCategoryChange('Toutes')}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                            >
                                Voir tous les articles
                            </button>
                        )}
                    </div>
                )}
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
                            Votre agrégateur d'actualités intelligent. Restez informé, restez connecté.
                        </p>
                        <nav className="mt-4" aria-label="Liens du footer">
                            <ul className="flex justify-center space-x-6 text-sm text-gray-400">
                                <li><a href="/about" className="hover:text-cyan-400 transition-colors">À propos</a></li>
                                <li><a href="/tendances" className="hover:text-cyan-400 transition-colors">Tendances</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}
