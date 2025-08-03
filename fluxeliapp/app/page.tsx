'use client'
import { Search, Filter, Globe, Clock, ExternalLink, Menu, X, Grid, List } from 'lucide-react';
import { useEffect, useState } from 'react'
import { fetchArticle } from '@/lib/fnct'
import { ArticleCard } from './components/ArticleCard'
import { Article } from '@/types/article'
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';

export default function FluxeliaApp() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>(['Toutes'])
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger les catégories disponibles
  async function loadCategories() {
    try {
      setLoading(true)
      setError(null)

      // Récupérer tous les articles pour extraire les catégories uniques
      const allArticles: Article[] = await fetchArticle('', 1000);
      const uniqueCats: string[] = Array.from(new Set(allArticles.map((a) => a.category))).sort();
      setCategories(['Toutes', ...uniqueCats]);

      // Charger les articles de la première catégorie (tous)
      setArticles(allArticles)
    } catch (err) {
      setError('Erreur lors du chargement des catégories')
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour charger les articles d'une catégorie spécifique
  async function loadArticlesByCategory(category: string) {
    try {
      setLoading(true)
      setError(null)

      // Si "Toutes" est sélectionné, on passe une chaîne vide ou undefined
      const categoryParam = category === 'Toutes' ? '' : category;
      const res: Article[] = await fetchArticle(categoryParam, 50);
      setArticles(res);
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
    await loadArticlesByCategory(newCategory)
  }

  // Chargement initial
  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Votre veille d'actualités
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              personnalisée
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les dernières actualités de vos sources préférées, organisées et filtrées selon vos centres d'intérêt.
          </p>
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
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600">
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Chargement...
              </span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{articles.length}</span> articles
                {selectedCategory && selectedCategory !== 'Toutes' && (
                  <span>
                    dans la catégorie <span className="font-semibold text-blue-600">{selectedCategory}</span>
                  </span>
                )}
              </>
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
        {loading ? (
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
        )}

        {/* Message si aucun article */}
        {!loading && articles.length === 0 && !error && (
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
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
      </footer>
    </div>
  );
}