import type { Product } from "@/pages/Catalog/CatalogProducts/types";

export interface BasketItem {
    product: Product;
    quantity: number;
}

export interface BasketState {
    items: BasketItem[];
    loading: boolean;
    error: string | null;
    // id товаров, по которым сейчас выполняется запрос (для блокировки кнопок)
    updatingIds: number[];
}
