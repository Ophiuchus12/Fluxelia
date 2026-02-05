'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, Menu, X, Search } from 'lucide-react'

const CATEGORIES = [
    { slug: '', name: 'Toutes', emoji: '🏠' },
    { slug: 'technologie', name: 'Technologie', emoji: '💻' },
    { slug: 'economie', name: 'Économie', emoji: '📈' },
    { slug: 'environnement', name: 'Environnement', emoji: '🌱' },
    { slug: 'sport', name: 'Sport', emoji: '⚽' },
    { slug: 'sante', name: 'Santé', emoji: '🏥' },
    { slug: 'actualites', name: 'Actualités', emoji: '📰' },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const pathname = usePathname()
    const router = useRouter()

    // Effet de scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Raccourci clavier "/" pour ouvrir la recherche
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !isSearchOpen) {
                e.preventDefault()
                setIsSearchOpen(true)
            }
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false)
                setSearchQuery('')
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isSearchOpen])

    // Focus sur l'input quand la recherche s'ouvre
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isSearchOpen])

    // Fermer le menu mobile lors du changement de route
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const links = [
        { href: '/', label: 'Articles' },
        { href: '/tendances', label: 'Tendances' },
        { href: '/about', label: 'À propos' },
    ]

    const isActive = (href: string) => pathname === href
    const isCategoryActive = (slug: string) => {
        if (slug === '') return pathname === '/'
        return pathname === `/categorie/${slug}`
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
            setIsSearchOpen(false)
            setSearchQuery('')
        }
    }

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-cyan-500/10'
                    : 'bg-gray-900/90 backdrop-blur-md'
            }`}
        >
            {/* ========== LIGNE 1 : Logo + Navigation + Recherche ========== */}
            <div className="border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
                    <div className="flex justify-between items-center h-14">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
                            <div className="relative">
                                <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Globe className="w-5 h-5 text-white" aria-hidden="true" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" aria-hidden="true"></div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Fluxelia
                            </span>
                        </Link>

                        {/* Navigation desktop */}
                        <div className="hidden md:flex items-center space-x-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                        isActive(link.href)
                                            ? 'text-cyan-400 bg-cyan-500/10'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions droite */}
                        <div className="flex items-center space-x-2">
                            {/* Bouton Recherche Desktop */}
                            <div className="hidden md:flex items-center">
                                {isSearchOpen ? (
                                    <form onSubmit={handleSearch} className="flex items-center">
                                        <div className="relative">
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Rechercher..."
                                                className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSearchOpen(false)
                                                setSearchQuery('')
                                            }}
                                            className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                                            aria-label="Fermer la recherche"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                                        aria-label="Ouvrir la recherche"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span className="text-sm hidden lg:inline">Rechercher</span>
                                        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded">
                                            /
                                        </kbd>
                                    </button>
                                )}
                            </div>

                            {/* Bouton recherche mobile */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Rechercher"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Menu mobile toggle */}
                            <button
                                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-expanded={isMenuOpen}
                                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            >
                                {isMenuOpen ? (
                                    <X className="w-5 h-5" aria-hidden="true" />
                                ) : (
                                    <Menu className="w-5 h-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* ========== LIGNE 2 : Catégories (Desktop) ========== */}
            <div className="hidden md:block border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-1 py-2 overflow-x-auto scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={cat.slug === '' ? '/' : `/categorie/${cat.slug}`}
                                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    isCategoryActive(cat.slug)
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/70'
                                }`}
                            >
                                <span aria-hidden="true">{cat.emoji}</span>
                                <span>{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== Barre de recherche mobile ========== */}
            {isSearchOpen && (
                <div className="md:hidden border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl">
                    <form onSubmit={handleSearch} className="px-4 py-3">
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher des articles..."
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* ========== Menu mobile dropdown ========== */}
            {isMenuOpen && (
                <div className="md:hidden border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl">
                    <div className="px-4 py-4 space-y-4">
                        {/* Navigation principale */}
                        <div className="flex flex-col space-y-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                                        isActive(link.href)
                                            ? 'text-cyan-400 bg-cyan-500/10'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Catégories en grille */}
                        <div className="border-t border-gray-800 pt-4">
                            <p className="px-2 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Catégories
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={cat.slug === '' ? '/' : `/categorie/${cat.slug}`}
                                        className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            isCategoryActive(cat.slug)
                                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                                                : 'text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-lg" aria-hidden="true">{cat.emoji}</span>
                                        <span>{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
