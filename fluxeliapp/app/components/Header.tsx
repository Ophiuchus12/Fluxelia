'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Globe, Menu, X, Search } from 'lucide-react'
import { Locale, getAllCategories, getLocalizedPath } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'
import { LanguageSwitcher } from './LanguageSwitcher'

interface HeaderProps {
    locale?: Locale
    currentPath?: string
}

export function Header({ locale: localeProp, currentPath = '/' }: HeaderProps) {
    // S'assurer que locale a une valeur valide
    const locale = localeProp || 'fr'
    
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const router = useRouter()
    
    // Debug
    console.log('[Header] locale:', locale, 'localeProp:', localeProp, 'currentPath:', currentPath)
    
    const t = getTranslations(locale)
    const categories = getAllCategories(locale)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Raccourci clavier pour la recherche
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim().length >= 2) {
            const searchPath = getLocalizedPath('/recherche', locale)
            router.push(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`)
            setIsSearchOpen(false)
            setSearchQuery('')
        }
    }

    const navLinks = [
        { href: getLocalizedPath('/', locale), label: t.header.articles },
        { href: getLocalizedPath('/tendances', locale), label: t.header.trends },
        { href: getLocalizedPath('/about', locale), label: t.header.about },
    ]

    const isActive = (href: string) => {
        if (href === getLocalizedPath('/', locale)) {
            return currentPath === '/' || currentPath === `/${locale}`
        }
        return currentPath.startsWith(href.replace(/\/$/, ''))
    }

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-gray-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                    : 'bg-gray-900/80 backdrop-blur-md'
            }`}
        >
            {/* Ligne 1: Logo + Navigation + Search + Language */}
            <div className="relative z-20 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href={getLocalizedPath('/', locale)} className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                    <Globe className="w-6 h-6 text-white" aria-hidden="true" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Fluxelia
                            </span>
                        </Link>

                        {/* Navigation desktop */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-base font-medium transition-colors ${
                                        isActive(link.href)
                                            ? 'text-white'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                    {/* Underline gradient pour l'état actif */}
                                    <span
                                        className={`absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-opacity ${
                                            isActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                        }`}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* Actions: Search + Language + Mobile menu */}
                        <div className="flex items-center space-x-3">
                            {/* Bouton recherche */}
                            {!isSearchOpen ? (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-cyan-500/50 rounded-lg transition-all"
                                    title={`${t.header.search} (/)`}
                                >
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <span className="hidden sm:inline text-sm text-gray-400">{t.header.search}</span>
                                    <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-gray-800 rounded text-gray-500">/</kbd>
                                </button>
                            ) : (
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t.header.searchPlaceholder}
                                        className="w-48 sm:w-72 pl-10 pr-4 py-2 bg-gray-900/80 border border-cyan-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                        autoFocus
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                                </form>
                            )}

                            {/* Language switcher */}
                            <LanguageSwitcher currentLocale={locale} />

                            {/* Menu mobile toggle */}
                            <button
                                className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-expanded={isMenuOpen}
                                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            >
                                {isMenuOpen ? (
                                    <X className="w-5 h-5 text-white" />
                                ) : (
                                    <Menu className="w-5 h-5 text-white" />
                                )}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Ligne 2: Catégories */}
            <div className="hidden md:block relative z-10 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-2 space-x-1 text-sm overflow-x-auto scrollbar-hide">
                        {/* Toutes les catégories */}
                        <Link
                            href={getLocalizedPath('/', locale)}
                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                                currentPath === '/' || currentPath === `/${locale}`
                                    ? 'text-cyan-400 bg-cyan-500/10'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            }`}
                        >
                            <span>🏠</span>
                            <span>{t.home.allCategories}</span>
                        </Link>

                        <span className="text-gray-600">•</span>

                        {categories.map((cat, index) => (
                            <div key={cat.slug} className="flex items-center">
                                <Link
                                    href={getLocalizedPath(`/categorie/${cat.slug}`, locale)}
                                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                                        currentPath.includes(`/categorie/${cat.slug}`)
                                            ? 'text-cyan-400 bg-cyan-500/10'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.name}</span>
                                </Link>
                                {index < categories.length - 1 && (
                                    <span className="text-gray-600 mx-1">•</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu mobile dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-700 bg-gray-900/95 backdrop-blur-xl">
                    <div className="px-4 py-4 space-y-2">
                        {/* Navigation links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2 rounded-lg font-medium ${
                                    isActive(link.href)
                                        ? 'text-cyan-400 bg-cyan-500/10'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Catégories mobile */}
                        <div className="border-t border-gray-700 mt-3 pt-3">
                            <p className="px-3 py-2 text-sm text-gray-500 font-medium">
                                {t.header.categories}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={getLocalizedPath(`/categorie/${cat.slug}`, locale)}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                                            currentPath.includes(`/categorie/${cat.slug}`)
                                                ? 'text-cyan-400 bg-cyan-500/10'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{cat.emoji}</span>
                                        <span className="text-sm">{cat.name}</span>
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
