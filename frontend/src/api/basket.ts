import { apiFetch } from "@/utils/api";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

export interface BasketItemResponse {
    product: Product;
    quantity: number;
}

export interface BasketResponse {
    items: BasketItemResponse[];
}

// GET /basket — содержимое корзины текущего пользователя (требует JWT)
export function getBasket(): Promise<BasketResponse> {
    return apiFetch<BasketResponse>("/basket");
}

// POST /basket — добавление товара в корзину текущего пользователя
export function addToBasket(productId: number, quantity: number): Promise<void> {
    return apiFetch<void>("/basket", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, quantity })
    });
}

// PATCH /basket/:id — изменение количества товара (quantity = 0 удаляет товар)
export function updateBasketItem(productId: number, quantity: number): Promise<void> {
    return apiFetch<void>(`/basket/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
    });
}

// DELETE /basket/:id — удаление товара из корзины
export function removeBasketItem(productId: number): Promise<void> {
    return apiFetch<void>(`/basket/${productId}`, {
        method: "DELETE"
    });
}
