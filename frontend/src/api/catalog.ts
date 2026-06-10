import { apiFetch } from "@/utils/api";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

export interface CatalogResponse {
    total_items: number;
    current_page: number;
    page_size: number;
    items: Product[];
}

// GET /catalog/:id — товары категории по её серверному id (slug на сервер не отправляем)
export function getProductsByCategory(categoryId: number, page = 0): Promise<CatalogResponse> {
    return apiFetch<CatalogResponse>(`/catalog/${categoryId}?page=${page}`);
}
