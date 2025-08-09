'use client'
import { fetchTendancesArticles } from "@/lib/fnct";
import { Article } from "@/types/article";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ArticleCard } from "../components/ArticleCard";


export default function Tendances() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchTendances() {
        try {
            setLoading(true);
            setError(null);
            const res: Article[] = await fetchTendancesArticles();
            if (!res) {
                throw new Error('Aucun article trouvé');
            }
            setArticles(res);

        } catch (err) {
            setError('Erreur de chargement des tendances');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTendances();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Effet de particules d'arrière-plan */}
            <div className="fixed inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <Header />
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">


                {/* Gestion des erreurs */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <div className="text-red-600 mr-3">⚠️</div>
                            <div>
                                <p className="text-red-800 font-medium">Erreur de chargement</p>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                            <button
                                onClick={() => fetchTendances()}
                                className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                )}
                {
                    loading ? (
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 max-w-4xl mx-auto'
                            }`}>
                            {/* Skeleton loaders */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="animate-pulse">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 max-w-4xl mx-auto'
                            }`}>
                            {Array.isArray(articles) && articles.map((article, index) => (
                                <ArticleCard
                                    key={`${article.url}-${index}`}
                                    article={article}
                                    viewMode={viewMode}
                                />
                            ))}

                        </div>
                    )
                }
            </main >
        </div>
    )

}