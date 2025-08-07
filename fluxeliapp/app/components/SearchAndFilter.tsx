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
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-2xl">
            {/* Barre de recherche futuriste */}
            <div className={`relative mb-6 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm opacity-0 transition-opacity duration-300"
                    style={{ opacity: isFocused ? 1 : 0 }}></div>
                <div className="relative flex items-center">
                    <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-cyan-400' : 'text-gray-400'
                        }`} />
                    <input
                        type="text"
                        placeholder="Rechercher dans le flux d'intelligence..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {searchTerm && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="animate-pulse w-2 h-2 bg-cyan-400 rounded-full"></div>
                        </div>
                    )}
                </div>
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
                            className="pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none appearance-none min-w-[180px] transition-all duration-200"
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
                <div className="flex items-center space-x-2 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        disabled={loading}
                        className={`p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${viewMode === 'grid'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                        title="Vue en grille"
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        disabled={loading}
                        className={`p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${viewMode === 'list'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
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