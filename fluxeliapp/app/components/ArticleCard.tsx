import { Article } from "@/types/article";
import { Clock, ExternalLink, Eye, Sparkles } from 'lucide-react';
import { useState } from "react";

interface ArticleCardProps {
    article: Article;
    viewMode: 'grid' | 'list';
}

export function ArticleCard({ article, viewMode }: ArticleCardProps) {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return "Il y a moins d'une heure";
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };
    const [isHovered, setIsHovered] = useState(false);

    const getCategoryColor = (category: string): string => {
        const colors: { [key: string]: string } = {
            'Technologie': 'bg-blue-500',
            'Economie': 'bg-orange-500',
            'Environnement': 'bg-green-500',
            'Finance': 'bg-yellow-500',
            'Sport': 'bg-red-500',
            'Santé': 'bg-purple-500',
        };
        return colors[category] || 'bg-gray-500';
    };

    if (viewMode === 'list') {
        return (
            <article
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Effet de lueur au survol */}
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <a href={article.url} target="_blank" rel="noopener noreferrer" className="relative block p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)} shadow-lg`}>
                                    {article.category}
                                </span>
                                <div className="flex items-center text-sm text-gray-400">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                                    {formatDate(article.published_at)}
                                </div>
                            </div>

                            <h2 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                {article.title}
                            </h2>

                            <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: article.short_description }}
                            />
                        </div>

                        <div className="ml-4 flex-shrink-0">
                            <div className={`p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 group-hover:border-cyan-500/50 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`}>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Vue grille (par défaut)
    return (
        <article
            className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Effet de scan lines */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent transform -skew-y-12 animate-pulse"></div>
            </div>

            <a href={article.url} target="_blank" rel="noopener noreferrer" className="relative block h-full">
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)} shadow-lg`}>
                            <Sparkles className="w-3 h-3 mr-1" />
                            {article.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-400">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                            {formatDate(article.published_at)}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 flex-grow">
                        {article.title}
                    </h2>

                    <p className="text-gray-300 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow"
                        dangerouslySetInnerHTML={{ __html: article.short_description }}
                    />

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 group-hover:border-cyan-500/30">
                        <span className="text-cyan-400 text-sm font-bold flex items-center group-hover:text-cyan-300">
                            <Eye className="w-4 h-4 mr-2" />
                            ANALYSER
                        </span>
                        <div className={`p-2 rounded-lg bg-gray-700/50 border border-gray-600/50 group-hover:border-cyan-500/50 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`}>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}