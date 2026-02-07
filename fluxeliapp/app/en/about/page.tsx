import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG, PAGES_SEO } from '@/lib/seo-config'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { getAllCategories, getLocalizedPath } from '@/lib/i18n'
import { getTranslations } from '@/lib/i18n/translations'
import { Globe, Zap, Database, Code, Rss, Shield, Clock, Users } from 'lucide-react'

const locale = 'en'

export const metadata: Metadata = {
    title: PAGES_SEO.about.en.title,
    description: PAGES_SEO.about.en.description,
    alternates: {
        canonical: `${SITE_CONFIG.url}/en/about`,
        languages: {
            'fr': `${SITE_CONFIG.url}/about`,
            'en': `${SITE_CONFIG.url}/en/about`,
        },
    },
}

export default function AboutPageEN() {
    const t = getTranslations(locale)
    const categories = getAllCategories(locale)

    const features = [
        { icon: <Rss className="w-6 h-6" />, title: t.about.features.rss.title, desc: t.about.features.rss.desc },
        { icon: <Zap className="w-6 h-6" />, title: t.about.features.realtime.title, desc: t.about.features.realtime.desc },
        { icon: <Database className="w-6 h-6" />, title: t.about.features.categorization.title, desc: t.about.features.categorization.desc },
        { icon: <Shield className="w-6 h-6" />, title: t.about.features.reliable.title, desc: t.about.features.reliable.desc },
        { icon: <Clock className="w-6 h-6" />, title: t.about.features.history.title, desc: t.about.features.history.desc },
        { icon: <Code className="w-6 h-6" />, title: t.about.features.opensource.title, desc: t.about.features.opensource.desc },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Header locale={locale} currentPath="/en/about" />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <nav className="flex items-center space-x-2 text-sm mb-8">
                    <Link href="/en" className="text-gray-400 hover:text-cyan-400">{t.breadcrumbs.home}</Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-cyan-400">{t.breadcrumbs.about}</span>
                </nav>

                <header className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
                        <span className="text-cyan-400 text-sm font-bold">{t.about.badge}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="text-white">{t.about.title} </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                            {t.about.titleHighlight}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.about.intro}</p>
                </header>

                <section className="mb-16">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <Users className="w-8 h-8 text-cyan-400 mr-3" />
                            {t.about.missionTitle}
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>{t.about.missionP1} <Link href="/en/trending" className="text-cyan-400 hover:underline">{t.about.missionLink}</Link>.</p>
                            <p>{t.about.missionP2} <strong className="text-purple-400">{t.about.missionHighlight}</strong> {t.about.missionP3}</p>
                        </div>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.about.featuresTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-all">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.about.categoriesTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                            <Link key={cat.slug} href={`/en/category/${cat.slug}`} className="flex items-center space-x-4 bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 hover:border-cyan-500/50 transition-all">
                                <span className="text-3xl">{cat.emoji}</span>
                                <span className="text-white font-bold">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-16">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30 p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">{t.about.techTitle}</h2>
                        <p className="text-gray-300 mb-6">{t.about.techDesc}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Python'].map((tech) => (
                                <span key={tech} className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full text-cyan-400 font-medium">{tech}</span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{t.about.ctaTitle}</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/en" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:opacity-90">{t.about.ctaArticles}</Link>
                        <Link href="/en/trending" className="px-6 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700">{t.about.ctaTrends}</Link>
                    </div>
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    )
}
