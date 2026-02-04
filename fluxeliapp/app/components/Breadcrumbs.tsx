'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Fil d'Ariane"
            className={`flex items-center space-x-2 text-sm ${className}`}
        >
            {/* Accueil */}
            <Link
                href="/"
                className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                title="Retour à l'accueil"
            >
                <Home className="w-4 h-4" />
                <span className="sr-only">Accueil</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-cyan-400 font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}

// Version pour les données structurées (sans client interactivity)
export function BreadcrumbsStatic({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Fil d'Ariane" className="flex items-center space-x-2 text-sm mb-6">
            <a
                href="/"
                className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </a>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {item.href ? (
                        <a href={item.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                            {item.label}
                        </a>
                    ) : (
                        <span className="text-cyan-400 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    )
}