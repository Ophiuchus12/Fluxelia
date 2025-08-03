import { Article } from "@/types/article";

export function ArticleCard({ article }: { article: Article }) {
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white shadow hover:shadow-md rounded-xl mb-4 transition">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{article.published_at}</p>
            <p className="mt-2 text-gray-800" dangerouslySetInnerHTML={{ __html: article.short_description }} />
            <span className="inline-block mt-3 px-2 py-1 text-xs text-white bg-blue-500 rounded">{article.category}</span>
        </a>
    )
}
