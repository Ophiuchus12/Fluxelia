/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://fluxelia.fr',
    generateRobotsTxt: true,
    generateIndexSitemap: true,

    // Fréquence de mise à jour pour Google
    changefreq: 'hourly',
    priority: 0.7,

    // Exclure les routes API et fichiers statiques
    exclude: [
        '/api/*',
        '/icon.png',
        '/favicon.ico',
        '/_next/*',
    ],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
            },
        ]
    },

    // Génération dynamique des URLs additionnelles (FR + EN)
    additionalPaths: async (config) => {
        const result = [];

        // Catégories
        const categories = [
            'technologie',
            'economie',
            'environnement',
            'sport',
            'sante',
            'actualites',
        ];

        // =====================
        // PAGES FRANÇAISES (défaut)
        // =====================

        // Page d'accueil FR
        result.push({
            loc: '/',
            changefreq: 'hourly',
            priority: 1.0,
            lastmod: new Date().toISOString(),
        });

        // Tendances FR
        result.push({
            loc: '/tendances',
            changefreq: 'hourly',
            priority: 0.9,
            lastmod: new Date().toISOString(),
        });

        // À propos FR
        result.push({
            loc: '/about',
            changefreq: 'monthly',
            priority: 0.5,
            lastmod: new Date().toISOString(),
        });

        // Recherche FR
        result.push({
            loc: '/recherche',
            changefreq: 'daily',
            priority: 0.6,
            lastmod: new Date().toISOString(),
        });

        // Catégories FR
        for (const cat of categories) {
            result.push({
                loc: `/categorie/${cat}`,
                changefreq: 'hourly',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            });
        }

        // =====================
        // PAGES ANGLAISES
        // =====================

        // Page d'accueil EN
        result.push({
            loc: '/en',
            changefreq: 'hourly',
            priority: 1.0,
            lastmod: new Date().toISOString(),
        });

        // Trending EN
        result.push({
            loc: '/en/trending',
            changefreq: 'hourly',
            priority: 0.9,
            lastmod: new Date().toISOString(),
        });

        // About EN
        result.push({
            loc: '/en/about',
            changefreq: 'monthly',
            priority: 0.5,
            lastmod: new Date().toISOString(),
        });

        // Search EN
        result.push({
            loc: '/en/search',
            changefreq: 'daily',
            priority: 0.6,
            lastmod: new Date().toISOString(),
        });

        // Categories EN
        for (const cat of categories) {
            result.push({
                loc: `/en/category/${cat}`,
                changefreq: 'hourly',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            });
        }

        return result;
    },

    // Transformer les URLs pour ajouter des métadonnées
    transform: async (config, path) => {
        // Priorités personnalisées par type de page
        let priority = 0.7;
        let changefreq = 'daily';

        // Accueil
        if (path === '/' || path === '/en') {
            priority = 1.0;
            changefreq = 'hourly';
        }
        // Catégories
        else if (path.startsWith('/categorie/') || path.startsWith('/en/category/')) {
            priority = 0.9;
            changefreq = 'hourly';
        }
        // Tendances
        else if (path === '/tendances' || path === '/en/trending') {
            priority = 0.9;
            changefreq = 'hourly';
        }
        // À propos
        else if (path === '/about' || path === '/en/about') {
            priority = 0.5;
            changefreq = 'monthly';
        }
        // Recherche
        else if (path === '/recherche' || path === '/en/search') {
            priority = 0.6;
            changefreq = 'daily';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
            // Alternates pour hreflang
            alternateRefs: getAlternateRefs(path),
        };
    },
};

// Helper pour générer les références alternatives (hreflang)
function getAlternateRefs(path) {
    const baseUrl = 'https://fluxelia.fr';

    // Mapping des routes FR <-> EN
    const routeMap = {
        '/': '/en',
        '/tendances': '/en/trending',
        '/about': '/en/about',
        '/recherche': '/en/search',
    };

    // Route FR -> trouver équivalent EN
    if (!path.startsWith('/en')) {
        // C'est une route FR
        let enPath = routeMap[path];

        // Gérer les catégories
        if (!enPath && path.startsWith('/categorie/')) {
            enPath = path.replace('/categorie/', '/en/category/');
        }

        if (enPath) {
            return [
                { hreflang: 'fr', href: `${baseUrl}${path}` },
                { hreflang: 'en', href: `${baseUrl}${enPath}` },
                { hreflang: 'x-default', href: `${baseUrl}${path}` },
            ];
        }
    } else {
        // C'est une route EN -> trouver équivalent FR
        let frPath = Object.entries(routeMap).find(([fr, en]) => en === path)?.[0];

        // Gérer les catégories
        if (!frPath && path.startsWith('/en/category/')) {
            frPath = path.replace('/en/category/', '/categorie/');
        }

        if (frPath) {
            return [
                { hreflang: 'fr', href: `${baseUrl}${frPath}` },
                { hreflang: 'en', href: `${baseUrl}${path}` },
                { hreflang: 'x-default', href: `${baseUrl}${frPath}` },
            ];
        }
    }

    return [];
}

module.exports = config;