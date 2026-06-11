import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchBasket,
    changeQuantity,
    removeItem,
    clearBasket,
    getBasketItems,
    getBasketLoading,
    getBasketError,
    getBasketUpdatingIds,
    getBasketTotalCount,
    getBasketTotalCost
} from "@/store/basket";
import type { BasketItem } from "@/store/basket";

export const useBasket = () => {
    const dispatch = useAppDispatch();

    const items = useAppSelector(getBasketItems);
    const loading = useAppSelector(getBasketLoading);
    const error = useAppSelector(getBasketError);
    const updatingIds = useAppSelector(getBasketUpdatingIds);
    const totalCount = useAppSelector(getBasketTotalCount);
    const totalCost = useAppSelector(getBasketTotalCost);

    useEffect(() => {
        dispatch(fetchBasket());
    }, [dispatch]);

    function isUpdating(productId: number): boolean {
        return updatingIds.includes(productId);
    }

    function increase(item: BasketItem) {
        // Не даём превысить остаток на складе (бэкенд тоже валидирует)
        const max = item.product.stock > 0 ? item.product.stock : item.quantity;
        const next = Math.min(item.quantity + 1, max);
        if (next !== item.quantity) {
            dispatch(changeQuantity({ productId: item.product.id, quantity: next }));
        }
    }

    function decrease(item: BasketItem) {
        // Минимум 1: количество не может стать отрицательным или нулевым,
        // полное удаление выполняется отдельной кнопкой
        const next = Math.max(item.quantity - 1, 1);
        if (next !== item.quantity) {
            dispatch(changeQuantity({ productId: item.product.id, quantity: next }));
        }
    }

    function setQuantity(item: BasketItem, value: number) {
        const max = item.product.stock > 0 ? item.product.stock : item.quantity;
        const safe = Number.isFinite(value) ? Math.floor(value) : 1;
        const clamped = Math.min(Math.max(safe, 1), max);
        if (clamped !== item.quantity) {
            dispatch(changeQuantity({ productId: item.product.id, quantity: clamped }));
        }
    }

    function remove(productId: number) {
        dispatch(removeItem(productId));
    }

    function clear() {
        dispatch(clearBasket());
    }

    return {
        items,
        loading,
        error,
        totalCount,
        totalCost,
        isUpdating,
        increase,
        decrease,
        setQuantity,
        remove,
        clear
    };
};

// Склонение слова "товар" в зависимости от количества
export function pluralizeProducts(count: number): string {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return "товаров";
    if (mod10 === 1) return "товар";
    if (mod10 >= 2 && mod10 <= 4) return "товара";
    return "товаров";
}
