'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Locale, getLocalizedPath } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'

interface FooterProps {
    locale?: Locale
}

export function Footer({ locale = 'fr' }: FooterProps) {
    const t = getTranslations(locale)

    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Fluxelia
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        {t.footer.tagline}
                    </p>
                    <nav className="mt-4" aria-label="Footer navigation">
                        <ul className="flex justify-center space-x-6 text-sm text-gray-400">
                            <li>
                                <Link
                                    href={getLocalizedPath('/about', locale)}
                                    className="hover:text-cyan-400 transition-colors"
                                >
                                    {t.footer.about}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={getLocalizedPath('/tendances', locale)}
                                    className="hover:text-cyan-400 transition-colors"
                                >
                                    {t.footer.trends}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    )
}