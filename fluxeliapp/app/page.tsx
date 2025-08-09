'use client'
import { Search, Filter, Globe, Clock, ExternalLink, Menu, X, Grid, List, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react'
import { fetchArticle, fetchCategories, fetchStats } from '@/lib/fnct'
import { ArticleCard } from './components/ArticleCard'
import { Article } from '@/types/article'
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ArticlePage } from '@/types/articlePage';

export default function FluxeliaApp() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>(['Toutes'])
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ countArticles: number; countCategories: number } | null>(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20 // ou 12, 30 selon ton UI

  // Fonction pour charger les catégories disponibles
  async function loadCategories() {
    try {
      setLoading(true)
      setError(null)

      const res: ArticlePage = await fetchArticle('', limit, 1)

      const uniqueCats = await fetchCategories();

      setCategories(['Toutes', ...uniqueCats])
      setArticles(res.articles)

      // <-- Ajouté : initialiser la pagination à partir de la réponse
      setPage(res.pagination?.page ?? 1)
      setTotalPages(res.pagination?.totalPages ?? 1)

      const statsRes = await fetchStats()
      setStats({ countArticles: statsRes.countArticles, countCategories: statsRes.countCategories })

      await loadArticlesByCategory(selectedCategory, 1);

    } catch (err) {
      setError('Erreur lors du chargement des catégories')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }



  // Fonction pour charger les articles d'une catégorie spécifique
  async function loadArticlesByCategory(category: string, pageToLoad: number = 1) {
    try {
      setLoading(true)
      setError(null)

      const categoryParam = category === 'Toutes' ? '' : category
      const res = await fetchArticle(categoryParam, limit, pageToLoad)

      setArticles(res.articles)
      setPage(pageToLoad)
      setTotalPages(res.pagination.totalPages)
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
    await loadArticlesByCategory(newCategory, 1) // reset à page 1
  }


  // Chargement initial
  useEffect(() => {
    loadCategories()
  }, [])

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
        {/* Section hero futuriste */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
            <Zap className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-cyan-400 text-sm font-bold">L'INFORMATION AUGMENTÉE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-white">Flux</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">elia</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transcendez l'information. Explorez
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold"> Fluxelia</span>
            {" "}qui révolutionne votre veille technologique.
          </p>

          {/* Stats en temps réel */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { label: "Sources Active", value: "2", icon: <Globe className="w-5 h-5" /> },
              { label: "Catégories", value: stats?.countCategories || 0, icon: <Zap className="w-5 h-5" /> },
              { label: "Nombres d'articles", value: stats?.countArticles || 0, icon: <TrendingUp className="w-5 h-5" /> }
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
        </div>

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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Erreur de chargement</p>
                <p className="text-red-600 text-sm">{error}</p>
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

        {/* Compteur d'articles avec état de chargement */}
        {/* Compteur d'articles */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">
                <span className="font-bold text-white text-xl">{articles.length}</span> signaux détectés
              </span>
            </div> */}
            {selectedCategory && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">•</span>
                <span className="text-cyan-400 font-medium">#{selectedCategory}</span>
              </div>
            )}
          </div>



          {/* Indicateur de catégorie active */}
          {selectedCategory && selectedCategory !== 'Toutes' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filtré par:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {selectedCategory}
              </span>
              <button
                onClick={() => handleCategoryChange('Toutes')}
                className="text-sm text-gray-500 hover:text-blue-600 underline"
              >
                Voir tout
              </button>
            </div>
          )}
        </div>

        {/* Grille d'articles avec état de chargement */}
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
              {articles.map((article, index) => (
                <ArticleCard
                  key={`${article.url}-${index}`}
                  article={article}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )
        }


        {/* Pagination futuriste */}
        {!loading && totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-2">
              <div className="flex items-center space-x-1">
                {/* Bouton Précédent */}
                <button
                  onClick={() => loadArticlesByCategory(selectedCategory, page - 1)}
                  disabled={page === 1}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${page === 1
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Précédent
                </button>

                {/* Numéros de pages avec logique d'ellipses */}
                <div className="flex items-center space-x-1 px-2">
                  {(() => {
                    const getVisiblePages = () => {
                      if (totalPages <= 6) {
                        // Si 7 pages ou moins, afficher toutes les pages
                        return Array.from({ length: totalPages }, (_, i) => i + 1);
                      }

                      const pages = [];

                      // Toujours afficher la première page
                      pages.push(1);

                      if (page <= 4) {
                        // Si on est au début, afficher 1,2,3,4,5...dernière
                        pages.push(2, 3, 4, 5);
                        if (totalPages > 6) pages.push('ellipsis1');
                        pages.push(totalPages);
                      } else if (page >= totalPages - 3) {
                        // Si on est à la fin, afficher 1...avant-dernière-3,avant-dernière-2,avant-dernière-1,dernière
                        if (totalPages > 6) pages.push('ellipsis1');
                        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                      } else {
                        // Au milieu, afficher 1...page-1,page,page+1...dernière
                        pages.push('ellipsis1');
                        pages.push(page - 1, page, page + 1);
                        pages.push('ellipsis2');
                        pages.push(totalPages);
                      }

                      return pages;
                    };

                    return getVisiblePages().map((p, index) => {
                      if (typeof p === 'string') {
                        // Ellipses
                        return (
                          <span key={p} className="px-2 py-2 text-gray-500 text-sm">
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={p}
                          onClick={() => loadArticlesByCategory(selectedCategory, p)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${p === page
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 scale-110'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:shadow-md hover:shadow-cyan-500/10 hover:scale-105'
                            }`}
                        >
                          {p}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Bouton Suivant */}
                <button
                  onClick={() => loadArticlesByCategory(selectedCategory, page + 1)}
                  disabled={page === totalPages}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${page === totalPages
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    }`}
                >
                  Suivant
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Indicateur de page actuelle */}
            <div className="ml-6 flex items-center">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 px-4 py-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Page</span>
                  <span className="text-white font-bold">{page}</span>
                  <span className="text-gray-500">sur</span>
                  <span className="text-cyan-400 font-bold">{totalPages}</span>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Message si aucun article */}
        {
          !loading && articles.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory && selectedCategory !== 'Toutes'
                  ? `Aucun article disponible dans la catégorie "${selectedCategory}".`
                  : 'Aucun article disponible pour le moment.'
                }
              </p>
              {selectedCategory && selectedCategory !== 'Toutes' && (
                <button
                  onClick={() => handleCategoryChange('Toutes')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir tous les articles
                </button>
              )}
            </div>
          )
        }
      </main >

      {/* Footer */}
      < footer className="bg-white border-t border-gray-200 mt-16" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fluxelia
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Votre agrégateur d'actualités intelligent. Restez informé, restez connecté.
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
}