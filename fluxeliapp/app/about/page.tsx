import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG, PAGES_SEO, CATEGORY_SEO } from '@/lib/seo-config'
import { JsonLd, generateBreadcrumbJsonLd, generateAboutPageJsonLd } from '../components/JsonLd'
import { Header } from '../components/Header'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Globe, Zap, Database, Code, Rss, Shield, Clock, Users } from 'lucide-react'

// ============================================
// MÉTADONNÉES SEO
// ============================================
export const metadata: Metadata = {
    title: PAGES_SEO.about.title,
    description: PAGES_SEO.about.description,

    keywords: [
        'fluxelia',
        'agrégateur actualités',
        'flux RSS',
        'veille informationnelle',
        'open source',
        'next.js',
    ],

    alternates: {
        canonical: `${SITE_CONFIG.url}/about`,
    },

    openGraph: {
        title: PAGES_SEO.about.title,
        description: PAGES_SEO.about.description,
        url: `${SITE_CONFIG.url}/about`,
        type: 'website',
    },

    twitter: {
        card: 'summary',
        title: 'À propos de Fluxelia',
        description: PAGES_SEO.about.description,
    },
}

// ============================================
// PAGE À PROPOS (SERVER COMPONENT - 100% SEO)
// ============================================
export default function AboutPage() {
    // Données structurées JSON-LD
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: 'Accueil', url: SITE_CONFIG.url },
        { name: 'À propos', url: `${SITE_CONFIG.url}/about` },
    ])

    const aboutJsonLd = generateAboutPageJsonLd()

    const features = [
        {
            icon: <Rss className="w-6 h-6" />,
            title: 'Agrégation RSS',
            description: 'Collecte automatique des flux RSS de sources fiables et reconnues.',
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Temps réel',
            description: 'Mise à jour continue pour ne rien manquer de l\'actualité.',
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: 'Catégorisation',
            description: 'Classification automatique par thèmes pour une navigation intuitive.',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Sources fiables',
            description: 'Sélection rigoureuse de médias reconnus et vérifiés.',
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: 'Historique',
            description: 'Conservation des articles sur 30 jours pour ne rien perdre.',
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: 'Open Source',
            description: 'Code source ouvert et transparent, construit avec Next.js et Python.',
        },
    ]

    const categories = Object.entries(CATEGORY_SEO).map(([slug, data]) => ({
        slug,
        ...data,
    }))

    return (
        <>
            {/* JSON-LD */}
            <JsonLd type="breadcrumb" data={breadcrumbJsonLd} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
                {/* Effets d'arrière-plan */}
                <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <Header />

                <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                    {/* Fil d'Ariane */}
                    <Breadcrumbs
                        items={[{ label: 'À propos' }]}
                        className="mb-8"
                    />

                    {/* Hero */}
                    <header className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
                            <span className="text-cyan-400 text-sm font-bold">À PROPOS</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="text-white">Découvrez </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                Fluxelia
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Fluxelia est votre hub d'information intelligent. Nous centralisons des flux RSS
                            provenant de multiples sources, les classons automatiquement par thèmes,
                            et les mettons à jour en continu grâce à un moteur de collecte automatisé.
                        </p>
                    </header>

                    {/* Mission */}
                    <section className="mb-16" aria-labelledby="mission-title">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12">
                            <h2 id="mission-title" className="text-3xl font-bold text-white mb-6 flex items-center">
                                <Users className="w-8 h-8 text-cyan-400 mr-3" aria-hidden="true" />
                                Notre Mission
                            </h2>
                            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                                <p>
                                    Chaque article est enregistré dans notre base avec son titre, sa date,
                                    sa description et son lien d'origine. Vous pouvez naviguer par catégories,
                                    filtrer vos intérêts, et accéder rapidement aux{' '}
                                    <Link href="/tendances" className="text-cyan-400 hover:underline">
                                        dernières tendances
                                    </Link>.
                                </p>
                                <p>
                                    L'objectif : vous offrir un <strong className="text-purple-400">tableau de bord unique</strong>{' '}
                                    pour rester informé, sans perdre de temps à visiter des dizaines de sites.
                                    En un clic, l'article complet s'ouvre sur la source originale.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Fonctionnalités */}
                    <section className="mb-16" aria-labelledby="features-title">
                        <h2 id="features-title" className="text-3xl font-bold text-white mb-8 text-center">
                            Fonctionnalités
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-all"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Catégories */}
                    <section className="mb-16" aria-labelledby="categories-title">
                        <h2 id="categories-title" className="text-3xl font-bold text-white mb-8 text-center">
                            Nos Catégories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/categorie/${cat.slug}`}
                                    className="flex items-center space-x-4 bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 hover:border-cyan-500/50 hover:bg-gray-800/70 transition-all"
                                >
                                    <span className="text-3xl" role="img" aria-hidden="true">{cat.emoji}</span>
                                    <div>
                                        <h3 className="text-white font-bold">{cat.title.replace(' | Fluxelia', '')}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-1">{cat.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Stack technique */}
                    <section className="mb-16" aria-labelledby="tech-title">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30 p-8 text-center">
                            <h2 id="tech-title" className="text-2xl font-bold text-white mb-4">
                                Stack Technique
                            </h2>
                            <p className="text-gray-300 mb-6">
                                Projet open-source construit avec des technologies modernes et performantes.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Python'].map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full text-cyan-400 font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Prêt à explorer l'actualité ?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Voir les articles
                            </Link>
                            <Link
                                href="/tendances"
                                className="px-6 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Découvrir les tendances
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Footer */}
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
                                Votre agrégateur d'actualités intelligent. Restez informé, restez connecté.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
