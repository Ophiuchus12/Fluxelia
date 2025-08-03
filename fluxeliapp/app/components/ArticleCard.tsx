import { Article } from "@/types/article";
import { Clock, ExternalLink } from 'lucide-react';

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
            <article className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getCategoryColor(article.category)}`}>
                                    {article.category}
                                </span>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {formatDate(article.published_at)}
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {article.title}
                            </h2>

                            <p
                                className="text-gray-600 text-sm line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: article.short_description }}
                            />
                        </div>

                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4 flex-shrink-0" />
                    </div>
                </a>
            </article>
        );
    }

    // Vue grille (par défaut)
    return (
        <article className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(article.category)}`}>
                            {article.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(article.published_at)}
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                    </h2>

                    <p
                        className="text-gray-600 text-sm line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{ __html: article.short_description }}
                    />

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                            Lire l'article
                        </span>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </div>
            </a>
        </article>
    );
}