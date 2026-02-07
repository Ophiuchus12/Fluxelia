import { Metadata } from 'next'
import { SITE_CONFIG, PAGES_SEO } from '@/lib/seo-config'
import { SearchPageEN } from '@/app/components/SearchPage'

export const metadata: Metadata = {
    title: PAGES_SEO.search.en.title,
    description: PAGES_SEO.search.en.description,
    alternates: {
        canonical: `${SITE_CONFIG.url}/en/search`,
        languages: {
            'fr': `${SITE_CONFIG.url}/recherche`,
            'en': `${SITE_CONFIG.url}/en/search`,
        },
    },
}

export default function SearchPage() {
    return <SearchPageEN />
}
