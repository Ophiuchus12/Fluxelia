'use client'
import Link from 'next/link'

export function Header() {
    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-4xl mx-auto flex justify-between items-center p-4">
                <Link href="/" className="text-xl font-bold text-blue-600">Fluxelia</Link>
                <div className="space-x-4">
                    <Link href="/" className="text-gray-700 hover:text-blue-500">Articles</Link>
                    <Link href="/about" className="text-gray-700 hover:text-blue-500">À propos</Link>
                </div>
            </nav>
        </header>
    )
}
