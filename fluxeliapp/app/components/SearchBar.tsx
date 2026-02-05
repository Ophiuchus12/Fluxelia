'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  autoFocus?: boolean
  onSearch?: (query: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SearchBar({
  initialQuery = '',
  placeholder = 'Rechercher dans les actualités...',
  autoFocus = false,
  onSearch,
  className = '',
  size = 'md',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Tailles selon la prop size
  const sizeClasses = {
    sm: 'py-2 pl-10 pr-10 text-sm',
    md: 'py-3 pl-12 pr-12 text-base',
    lg: 'py-4 pl-14 pr-14 text-lg',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const iconPositions = {
    sm: 'left-3',
    md: 'left-4',
    lg: 'left-5',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (query.trim().length < 2) return
    
    setIsLoading(true)
    
    if (onSearch) {
      onSearch(query.trim())
      setIsLoading(false)
    } else {
      // Navigation vers la page de recherche
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  // Raccourci clavier "/" pour focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // Escape pour fermer
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      {/* Effet de glow au focus */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm transition-opacity duration-300 ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Icône de recherche ou loader */}
        {isLoading ? (
          <Loader2
            className={`absolute ${iconPositions[size]} top-1/2 -translate-y-1/2 ${iconSizes[size]} text-cyan-400 animate-spin`}
            aria-hidden="true"
          />
        ) : (
          <Search
            className={`absolute ${iconPositions[size]} top-1/2 -translate-y-1/2 ${iconSizes[size]} transition-colors duration-200 ${
              isFocused ? 'text-cyan-400' : 'text-gray-400'
            }`}
            aria-hidden="true"
          />
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full ${sizeClasses[size]} bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all duration-200`}
          aria-label="Rechercher"
        />

        {/* Bouton clear ou raccourci */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2`}>
          {query ? (
            <>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className={iconSizes[size]} />
              </button>
              <button
                type="submit"
                className="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                aria-label="Lancer la recherche"
              >
                <ArrowRight className={iconSizes[size]} />
              </button>
            </>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Hint sous l'input */}
      {isFocused && query.length > 0 && query.length < 2 && (
        <p className="absolute mt-1 text-xs text-gray-500">
          Minimum 2 caractères
        </p>
      )}
    </form>
  )
}
