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
        ],
        additionalSitemaps: [
            'https://fluxelia.fr/sitemap.xml',
            'https://fluxelia.fr/sitemap-categories.xml',
        ],
    },

    // Génération dynamique des URLs additionnelles
    additionalPaths: async (config) => {
        const result = [];

        // Catégories statiques (tu peux les rendre dynamiques via API)
        const categories = [
            'technologie',
            'economie',
            'environnement',
            'sport',
            'sante',
            'actualites',
        ];

        // Ajouter les pages de catégories
        for (const cat of categories) {
            result.push({
                loc: `/categorie/${cat}`,
                changefreq: 'hourly',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            });
        }

        // Pages principales avec priorité haute
        result.push({
            loc: '/',
            changefreq: 'hourly',
            priority: 1.0,
            lastmod: new Date().toISOString(),
        });

        result.push({
            loc: '/tendances',
            changefreq: 'hourly',
            priority: 0.9,
            lastmod: new Date().toISOString(),
        });

        result.push({
            loc: '/about',
            changefreq: 'monthly',
            priority: 0.5,
            lastmod: new Date().toISOString(),
        });

        return result;
    },

    // Transformer les URLs pour ajouter des métadonnées
    transform: async (config, path) => {
        // Priorités personnalisées par type de page
        let priority = 0.7;
        let changefreq = 'daily';

        if (path === '/') {
            priority = 1.0;
            changefreq = 'hourly';
        } else if (path.startsWith('/categorie/')) {
            priority = 0.9;
            changefreq = 'hourly';
        } else if (path === '/tendances') {
            priority = 0.9;
            changefreq = 'hourly';
        } else if (path === '/about') {
            priority = 0.5;
            changefreq = 'monthly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};

module.exports = config;