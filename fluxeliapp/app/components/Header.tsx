'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Globe, Menu, X, ChevronDown } from 'lucide-react'

const CATEGORIES = [
    { slug: 'technologie', name: 'Technologie', emoji: '💻' },
    { slug: 'economie', name: 'Économie', emoji: '📈' },
    { slug: 'environnement', name: 'Environnement', emoji: '🌱' },
    { slug: 'sport', name: 'Sport', emoji: '⚽' },
    { slug: 'sante', name: 'Santé', emoji: '🏥' },
    { slug: 'actualites', name: 'Actualités', emoji: '📰' },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Fermer le menu des catégories quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = () => setIsCategoriesOpen(false)
        if (isCategoriesOpen) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [isCategoriesOpen])

    const links = [
        { href: '/', label: 'Articles' },
        { href: '/tendances', label: 'Tendances' },
        { href: '/about', label: 'À propos' },
    ]

    const isActive = (href: string) => pathname === href
    const isCategoryActive = pathname.startsWith('/categorie')

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? 'bg-gray-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                    : 'bg-gray-900/80 backdrop-blur-md'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Globe className="w-6 h-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" aria-hidden="true"></div>
                        </div>
                        <div className="relative">
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Fluxelia
                            </span>
                            <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" aria-hidden="true"></div>
                        </div>
                    </Link>

                    {/* Navigation desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-medium transition-colors ${isActive(link.href)
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold border-b-2 border-cyan-400 pb-1'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Dropdown Catégories */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsCategoriesOpen(!isCategoriesOpen)
                                }}
                                className={`flex items-center space-x-1 font-medium transition-colors ${isCategoryActive
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                aria-expanded={isCategoriesOpen}
                                aria-haspopup="true"
                            >
                                <span>Catégories</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                            </button>

                            {isCategoriesOpen && (
                                <div
                                    className="absolute top-full right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-xl overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="py-2">
                                        {CATEGORIES.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/categorie/${cat.slug}`}
                                                onClick={() => setIsCategoriesOpen(false)}
                                                className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-700/50 transition-colors ${pathname === `/categorie/${cat.slug}` ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300'
                                                    }`}
                                            >
                                                <span className="text-lg" aria-hidden="true">{cat.emoji}</span>
                                                <span>{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5 text-white" aria-hidden="true" />
                        ) : (
                            <Menu className="w-5 h-5 text-white" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Menu mobile dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-700 py-4">
                        <div className="flex flex-col space-y-2">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg font-medium ${isActive(link.href)
                                            ? 'text-cyan-400 bg-cyan-500/10'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Catégories mobile */}
                            <div className="border-t border-gray-700 mt-2 pt-2">
                                <p className="px-3 py-2 text-sm text-gray-500 font-medium">Catégories</p>
                                {CATEGORIES.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/categorie/${cat.slug}`}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${pathname === `/categorie/${cat.slug}`
                                                ? 'text-cyan-400 bg-cyan-500/10'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span aria-hidden="true">{cat.emoji}</span>
                                        <span>{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}