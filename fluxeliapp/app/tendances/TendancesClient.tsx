'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { ArticleCard } from '@/app/components/ArticleCard'
import { Article } from '@/types/article'
import { TrendingUp, Flame, Globe, Grid, List } from 'lucide-react'
import { Locale, getAllCategories, getLocalizedPath, getCategoryEmoji } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'

interface TendancesClientProps {
    locale: Locale
    initialArticles: Article[]
    articlesByCategory: Record<string, Article[]>
}

const CATEGORY_COLORS: Record<string, string> = {
    technologie: 'from-blue-500 to-cyan-500',
    economie: 'from-orange-500 to-yellow-500',
    environnement: 'from-green-500 to-emerald-500',
    sport: 'from-red-500 to-orange-500',
    sante: 'from-purple-500 to-pink-500',
    actualites: 'from-gray-500 to-slate-500',
}

export function TendancesClient({ locale: localeProp, initialArticles, articlesByCategory }: TendancesClientProps) {
    // S'assurer que locale a une valeur valide
    const locale = localeProp || 'fr'
    
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const t = getTranslations(locale)
    const categories = getAllCategories(locale)
    const currentPath = getLocalizedPath('/tendances', locale)
    
    // Debug: afficher la locale dans la console
    console.log('[TendancesClient] locale:', locale, 'localeProp:', localeProp)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <Header locale={locale} currentPath={currentPath} />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
                    <Link href={getLocalizedPath('/', locale)} className="text-gray-400 hover:text-cyan-400">
                        {t.breadcrumbs.home}
                    </Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-cyan-400">{t.breadcrumbs.trends}</span>
                </nav>

                {/* Header */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30 mb-6">
                        <Flame className="w-4 h-4 text-orange-400 mr-2" />
                        <span className="text-orange-400 text-sm font-bold">{t.trends.badge}</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="text-white">{t.trends.title} </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                            {t.trends.titleHighlight}
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        {t.trends.subtitle}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <TrendingUp className="w-4 h-4 text-orange-400" />
                            <span className="text-white font-bold">{initialArticles.length}</span>
                            <span className="text-gray-400 text-sm">{t.trends.trendingArticles}</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-bold">{Object.keys(articlesByCategory).length}</span>
                            <span className="text-gray-400 text-sm">{t.trends.categories}</span>
                        </div>
                    </div>

                    {/* View mode */}
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Sections par catégorie */}
                {Object.entries(articlesByCategory).map(([categorySlug, articles]) => {
                    const category = categories.find(c => c.slug === categorySlug)
                    const color = CATEGORY_COLORS[categorySlug] || 'from-gray-500 to-gray-600'

                    return (
                        <section key={categorySlug} className="mb-16">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{category?.emoji || getCategoryEmoji(categorySlug)}</span>
                                    <h2 className="text-2xl font-bold text-white">
                                        {category?.name || categorySlug}
                                    </h2>
                                    <span className="px-2 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
                                        {articles.length} articles
                                    </span>
                                </div>
                                <Link
                                    href={getLocalizedPath(`/categorie/${categorySlug}`, locale)}
                                    className={`px-4 py-2 bg-gradient-to-r ${color} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
                                >
                                    {t.trends.viewAll}
                                </Link>
                            </div>

                            <div className={`grid gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                                : 'grid-cols-1 max-w-4xl'
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
                        </section>
                    )
                })}

                {/* No articles */}
                {initialArticles.length === 0 && (
                    <div className="text-center py-16">
                        <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">{t.trends.noTrends}</h2>
                        <p className="text-gray-500 mb-4">{t.trends.noTrendsDesc}</p>
                        <Link
                            href={getLocalizedPath('/', locale)}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                        >
                            {t.trends.backHome}
                        </Link>
                    </div>
                )}
            </main>

            <Footer locale={locale} />
        </div>
    )
}
