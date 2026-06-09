
export function parsePagination(query: any) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    return {
        page: Math.max(1, page),
        limit: Math.max(1, Math.min(100, limit)), // límite máximo 100
    };
}