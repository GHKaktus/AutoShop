import { apiFetch } from "@/utils/api";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

// GET /products/:id — полная информация о конкретном товаре
export function getProduct(productId: number): Promise<Product> {
    return apiFetch<Product>(`/products/${productId}`);
}
