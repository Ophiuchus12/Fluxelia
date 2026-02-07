import { Metadata } from 'next'
import { SITE_CONFIG, PAGES_SEO } from '@/lib/seo-config'
import { SearchPageFR } from '@/app/components/SearchPage'

export const metadata: Metadata = {
    title: PAGES_SEO.search.fr.title,
    description: PAGES_SEO.search.fr.description,
    alternates: {
        canonical: `${SITE_CONFIG.url}/recherche`,
        languages: {
            'fr': `${SITE_CONFIG.url}/recherche`,
            'en': `${SITE_CONFIG.url}/en/search`,
        },
    },
}

export default function RecherchePage() {
    return <SearchPageFR />
}
