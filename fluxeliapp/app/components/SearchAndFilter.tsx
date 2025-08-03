import { useState } from "react";
import { Search, Filter, Grid, List, Loader } from 'lucide-react';

interface SearchAndFilterProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    categories: string[];
    loading?: boolean;
}

export function SearchAndFilter({
    selectedCategory,
    onCategoryChange,
    viewMode,
    onViewModeChange,
    categories,
    loading = false,
}: SearchAndFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            {/* Barre de recherche */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Rechercher dans les articles..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />
            </div>

            {/* Filtres et options d'affichage */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    {/* Sélecteur de catégorie stylé */}
                    <div className="relative">
                        {loading ? (
                            <Loader className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10 animate-spin" />
                        ) : (
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                        )}
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[150px] disabled:bg-gray-50 disabled:cursor-not-allowed"
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            disabled={loading}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Indicateur de nombre de catégories */}
                    <span className="text-sm text-gray-500">
                        {categories.length - 1} catégories disponibles
                    </span>
                </div>

                {/* Mode d'affichage */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        disabled={loading}
                        className={`p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${viewMode === 'grid'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                        title="Vue en grille"
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        disabled={loading}
                        className={`p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${viewMode === 'list'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                        title="Vue en liste"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Barre de progression pendant le chargement */}
            {loading && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}