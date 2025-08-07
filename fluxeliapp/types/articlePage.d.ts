export interface ArticlePage {
    articles: Article[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}