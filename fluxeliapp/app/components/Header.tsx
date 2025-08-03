'use client'
import Link from 'next/link'
import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Fluxelia
                        </h1>
                    </div>

                    {/* Navigation desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Articles
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Tendances
                        </a>
                        <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            À propos
                        </a>
                    </div>

                    {/* Menu mobile */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu mobile dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-3">
                            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                Articles
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                Tendances
                            </a>
                            <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                À propos
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}