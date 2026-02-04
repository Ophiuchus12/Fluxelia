'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { ArticleCard } from '@/app/components/ArticleCard'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'
import { Article } from '@/types/article'
import { TrendingUp, Flame, Globe, Grid, List } from 'lucide-react'

interface TendancesClientProps {
    initialArticles: Article[]
    articlesByCategory: Record<string, Article[]>
}

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; slug: string }> = {
    'Technologie': { emoji: '💻', color: 'from-blue-500 to-cyan-500', slug: 'technologie' },
    'Economie': { emoji: '📈', color: 'from-orange-500 to-yellow-500', slug: 'economie' },
    'Environnement': { emoji: '🌱', color: 'from-green-500 to-emerald-500', slug: 'environnement' },
    'Sport': { emoji: '⚽', color: 'from-red-500 to-orange-500', slug: 'sport' },
    'Santé': { emoji: '🏥', color: 'from-purple-500 to-pink-500', slug: 'sante' },
    'Actualités': { emoji: '📰', color: 'from-gray-500 to-slate-500', slug: 'actualites' },
}

export function TendancesClient({ initialArticles, articlesByCategory }: TendancesClientProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Effet de particules */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <Header />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                {/* Fil d'Ariane */}
                <Breadcrumbs
                    items={[{ label: 'Tendances' }]}
                    className="mb-8"
                />

                {/* En-tête */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30 mb-6">
                        <Flame className="w-4 h-4 text-orange-400 mr-2" aria-hidden="true" />
                        <span className="text-orange-400 text-sm font-bold">TENDANCES DU MOMENT</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="text-white">Les </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                            Tendances
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Découvrez les 5 articles les plus récents dans chaque catégorie.
                        Restez à la pointe de l'actualité avec notre sélection quotidienne.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <TrendingUp className="w-4 h-4 text-orange-400" aria-hidden="true" />
                            <span className="text-white font-bold">{initialArticles.length}</span>
                            <span className="text-gray-400 text-sm">articles tendances</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <Globe className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                            <span className="text-white font-bold">{Object.keys(articlesByCategory).length}</span>
                            <span className="text-gray-400 text-sm">catégories</span>
                        </div>
                    </div>

                    {/* Mode d'affichage */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                aria-pressed={viewMode === 'grid'}
                            >
                                <Grid className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                aria-pressed={viewMode === 'list'}
                            >
                                <List className="w-4 h-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Sections par catégorie */}
                {Object.entries(articlesByCategory).map(([category, articles]) => {
                    const config = CATEGORY_CONFIG[category] || { emoji: '📄', color: 'from-gray-500 to-gray-600', slug: category.toLowerCase() }

                    return (
                        <section key={category} className="mb-16" aria-labelledby={`category-${config.slug}`}>
                            {/* En-tête de catégorie */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl" role="img" aria-hidden="true">{config.emoji}</span>
                                    <h2 id={`category-${config.slug}`} className="text-2xl font-bold text-white">
                                        {category}
                                    </h2>
                                    <span className="px-2 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
                                        {articles.length} articles
                                    </span>
                                </div>
                                <Link
                                    href={`/categorie/${config.slug}`}
                                    className={`px-4 py-2 bg-gradient-to-r ${config.color} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
                                >
                                    Voir tout →
                                </Link>
                            </div>

                            {/* Articles */}
                            <div
                                className={`grid gap-6 ${viewMode === 'grid'
                                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                                        : 'grid-cols-1 max-w-4xl'
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
                    )
                })}

                {/* Si aucun article */}
                {initialArticles.length === 0 && (
                    <div className="text-center py-16">
                        <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" aria-hidden="true" />
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">
                            Aucune tendance disponible
                        </h2>
                        <p className="text-gray-500 mb-4">
                            Les tendances seront disponibles dès que des articles seront collectés.
                        </p>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                            Retour à l'accueil
                        </Link>
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
                            Votre agrégateur d'actualités intelligent.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}