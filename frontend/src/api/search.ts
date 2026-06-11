import { apiFetch } from "@/utils/api";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

export interface SearchResponse {
    total_items: number;
    current_page: number;
    page_size: number;
    items: Product[];
}

// GET /search?q=&page= — поиск товаров по строке запроса
export function searchProducts(query: string, page = 0): Promise<SearchResponse> {
    return apiFetch<SearchResponse>(`/search?q=${encodeURIComponent(query)}&page=${page}`);
}
