'use client'

import { Article } from '@/types/article'
import { ExternalLink, Eye, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Locale } from '@/lib/i18n'
import { formatRelativeDate, getTranslations } from '@/lib/i18n/translations'

interface ArticleCardProps {
    article: Article
    viewMode?: 'grid' | 'list'
    locale?: Locale
}

// Fonction pour nettoyer le HTML et extraire le texte
function stripHtml(html: string | null | undefined): string {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').trim()
}

export function ArticleCard({ article, viewMode = 'grid', locale = 'fr' }: ArticleCardProps) {
    const [mounted, setMounted] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const t = getTranslations(locale)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Utiliser un placeholder pendant l'hydratation
    const formattedDate = mounted ? formatRelativeDate(article.published_at, locale) : '...'

    // Nettoyer la description (pas de dangerouslySetInnerHTML)
    const description = stripHtml(article.short_description)

    const getCategoryColor = (categorySlug?: string): string => {
        const colors: Record<string, string> = {
            technologie: 'from-blue-500 to-cyan-500',
            economie: 'from-orange-500 to-yellow-500',
            environnement: 'from-green-500 to-emerald-500',
            actualites: 'from-gray-500 to-slate-500',
            sport: 'from-red-500 to-orange-500',
            sante: 'from-purple-500 to-pink-500',
        }
        return colors[categorySlug || ''] || 'from-gray-500 to-gray-600'
    }

    if (viewMode === 'list') {
        return (
            <article
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <a href={article.url} target="_blank" rel="noopener noreferrer" className="relative block p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category_slug)} shadow-lg`}>
                                    {article.category}
                                </span>
                                <div className="flex items-center text-sm text-gray-400">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
                                    {formattedDate}
                                </div>
                            </div>

                            <h2 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                {article.title}
                            </h2>

                            {description && (
                                <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>

                        <div className="ml-4 flex-shrink-0">
                            <div className={`p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 group-hover:border-cyan-500/50 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`}>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        )
    }

    // Vue grille
    return (
        <article
            className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent transform -skew-y-12 animate-pulse" />
            </div>

            <a href={article.url} target="_blank" rel="noopener noreferrer" className="relative block h-full">
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category_slug)} shadow-lg`}>
                            <Sparkles className="w-3 h-3 mr-1" />
                            {article.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-400">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
                            {formattedDate}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {article.title}
                    </h2>

                    <p className="text-gray-300 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                        {description || '\u00A0'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 group-hover:border-cyan-500/30">
                        <span className="text-cyan-400 text-sm font-bold flex items-center group-hover:text-cyan-300">
                            <Eye className="w-4 h-4 mr-2" />
                            {t.article.analyze}
                        </span>
                        <div className={`p-2 rounded-lg bg-gray-700/50 border border-gray-600/50 group-hover:border-cyan-500/50 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`}>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </a>
        </article>
    )
}