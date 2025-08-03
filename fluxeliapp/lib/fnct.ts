export async function fetchArticle(categorie = '', nbShown = 1000) {
    const params = new URLSearchParams()
    if (categorie) params.append('categorie', categorie)
    if (nbShown) params.append('nbShown', nbShown.toString())

    const response = await fetch(`/api/articles?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
}