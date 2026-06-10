import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

export const getBasketItems = (state: RootState) => state.basket.items;
export const getBasketLoading = (state: RootState) => state.basket.loading;
export const getBasketError = (state: RootState) => state.basket.error;
export const getBasketUpdatingIds = (state: RootState) => state.basket.updatingIds;

// Эффективная цена товара: скидочная, если она задана и меньше обычной
export function effectiveCost(product: Product): number {
    return product.sale_cost >= 0 && product.sale_cost < product.cost
        ? product.sale_cost
        : product.cost;
}

export const getBasketTotalCount = createSelector([getBasketItems], (items) =>
    items.reduce((sum, item) => sum + item.quantity, 0)
);

export const getBasketTotalCost = createSelector([getBasketItems], (items) =>
    items.reduce((sum, item) => sum + effectiveCost(item.product) * item.quantity, 0)
);
