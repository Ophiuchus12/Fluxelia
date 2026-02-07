'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Newspaper } from 'lucide-react'
import { i18nConfig, Locale, isValidLocale, removeLocaleFromPathname } from '@/lib/i18n'

interface LanguageSwitcherProps {
    currentLocale?: Locale
    className?: string
}

// Descriptions des sources par langue
const LOCALE_INFO: Record<Locale, { flag: string; name: string; sources: string }> = {
    fr: {
        flag: '🇫🇷',
        name: 'Français',
        sources: 'Korben, Le Monde, L\'Équipe...',
    },
    en: {
        flag: '🇬🇧',
        name: 'English',
        sources: 'TechCrunch, BBC, Reuters...',
    },
}

export function LanguageSwitcher({ currentLocale = 'fr', className = '' }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLocaleChange = (newLocale: Locale) => {
        // Récupérer le chemin sans la locale actuelle
        let pathWithoutLocale = removeLocaleFromPathname(pathname)
        
        // Traduire les slugs de routes selon la langue cible
        if (newLocale === 'en') {
            // FR -> EN
            pathWithoutLocale = pathWithoutLocale
                .replace(/^\/tendances/, '/trending')
                .replace(/^\/recherche/, '/search')
                .replace(/^\/categorie\//, '/category/')
        } else if (newLocale === 'fr') {
            // EN -> FR
            pathWithoutLocale = pathWithoutLocale
                .replace(/^\/trending/, '/tendances')
                .replace(/^\/search/, '/recherche')
                .replace(/^\/category\//, '/categorie/')
        }
        
        // Construire le nouveau chemin
        let newPath: string
        if (newLocale === i18nConfig.defaultLocale) {
            // Pour FR (défaut), pas de préfixe
            newPath = pathWithoutLocale || '/'
        } else {
            // Pour les autres langues, ajouter le préfixe
            newPath = `/${newLocale}${pathWithoutLocale || ''}`
        }

        // Définir le cookie de préférence
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`
        
        // Naviguer vers la nouvelle URL
        router.push(newPath)
        setIsOpen(false)
    }

    const currentInfo = LOCALE_INFO[currentLocale]

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/50 rounded-lg transition-all"
                aria-expanded={isOpen}
                aria-haspopup="true"
                title={`${currentInfo.name} - ${currentInfo.sources}`}
            >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">
                    {currentInfo.flag}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-xl overflow-hidden z-[100]">
                    {/* Header explicatif */}
                    <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-700/50">
                        <div className="flex items-center space-x-2 text-xs text-cyan-400">
                            <Newspaper className="w-3.5 h-3.5" />
                            <span className="font-medium">
                                {currentLocale === 'fr' ? 'Sources différentes par langue' : 'Different sources per language'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="py-1">
                        {i18nConfig.locales.map((locale) => {
                            const info = LOCALE_INFO[locale]
                            const isSelected = locale === currentLocale
                            
                            return (
                                <button
                                    key={locale}
                                    onClick={() => handleLocaleChange(locale)}
                                    className={`w-full text-left px-4 py-3 transition-colors ${
                                        isSelected
                                            ? 'bg-cyan-500/10'
                                            : 'hover:bg-gray-700/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{info.flag}</span>
                                            <div>
                                                <div className={`text-sm font-medium ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                                                    {info.name}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {info.sources}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <span className="text-cyan-400 text-sm">✓</span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
