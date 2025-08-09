import { Header } from "../components/Header"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Effets d’arrière-plan */}
            <div className="fixed inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                {/* Contenu */}
                <div className="relative max-w-4xl mx-auto text-center p-8 md:p-16">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
                        <span className="text-cyan-400 text-sm font-bold">À PROPOS</span>
                    </div>

                    {/* Titre */}
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="text-white">Découvrez </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                            Fluxelia
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                        Fluxelia est votre hub d’information intelligent. Nous centralisons des flux RSS provenant de multiples sources,
                        les classons automatiquement par <span className="font-semibold text-cyan-400">thèmes</span>, et les mettons à jour en continu
                        grâce à un moteur de collecte automatisé.
                    </p>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                        Chaque article est enregistré dans notre base avec son titre, sa date, sa description et son lien d’origine.
                        Vous pouvez naviguer par catégories, filtrer vos intérêts, et accéder rapidement aux{" "}
                        <span className="font-semibold text-blue-400">dernières tendances</span>.
                    </p>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
                        L’objectif : vous offrir un <span className="font-semibold text-purple-400">tableau de bord unique</span> pour rester informé,
                        sans perdre de temps à visiter des dizaines de sites. En un clic, l’article complet s’ouvre sur la source originale.
                    </p>

                    {/* Footer */}
                    <p className="text-sm text-gray-500">
                        Projet open-source – Construit avec <span className="text-cyan-400">Next.js</span>,{" "}
                        <span className="text-cyan-400">SQLite</span> & <span className="text-cyan-400">Python</span>
                    </p>
                </div>
            </main>
        </div>
    )
}
