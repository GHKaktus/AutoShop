import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "./types";
import { getProductsByCategory } from "@/api/catalog";
import { addToBasket } from "@/api/basket";
import { useAppSelector } from "@/store/hooks";
import { getCategoryBySlug } from "@/store/categories";
import { registerProductsCategory } from "@/utils/productImage";

export const useCatalogProducts = () => {
    const { slug = "" } = useParams<{ slug: string }>();

    // slug — фронтовый: по нему из стора достаём категорию, а на сервер уходит её id.
    const category = useAppSelector(getCategoryBySlug(slug));
    const categoryId = category?.id ?? null;
    const categoryName = category?.name ?? "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Количество товара храним отдельно для каждой карточки (ключ — id товара)
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
    const [basketError, setBasketError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (categoryId === null) {
                setError("Категория не найдена");
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await getProductsByCategory(categoryId, 0);
                if (cancelled) return;

                setProducts(response.items);
                registerProductsCategory(response.items, categoryId);
                setQuantities(
                    Object.fromEntries(response.items.map((product) => [product.id, 1]))
                );
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Не удалось загрузить товары");
                setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [categoryId]);

    const stockById = useMemo(() => {
        const map: Record<number, number> = {};
        for (const product of products) map[product.id] = product.stock;
        return map;
    }, [products]);

    // Границы цен для ползунка диапазона (по эффективной цене с учётом скидки)
    const priceBounds = useMemo(() => {
        if (products.length === 0) return { min: 0, max: 0 };
        const prices = products.map((p) =>
            p.sale_cost >= 0 && p.sale_cost < p.cost ? p.sale_cost : p.cost
        );
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        };
    }, [products]);

    const getQuantity = useCallback(
        (productId: number): number => quantities[productId] ?? 1,
        [quantities]
    );

    const increaseQuantity = useCallback(
        (productId: number) => {
            setQuantities((prev) => {
                const stock = stockById[productId] ?? Infinity;
                const current = prev[productId] ?? 1;
                return { ...prev, [productId]: Math.min(current + 1, stock) };
            });
        },
        [stockById]
    );

    const decreaseQuantity = useCallback((productId: number) => {
        setQuantities((prev) => {
            const current = prev[productId] ?? 1;
            // Количество товара в наличии не может быть меньше 1
            return { ...prev, [productId]: Math.max(current - 1, 1) };
        });
    }, []);

    const setQuantity = useCallback(
        (productId: number, value: number) => {
            setQuantities((prev) => {
                const stock = stockById[productId] ?? Infinity;
                const safe = Number.isFinite(value) ? Math.floor(value) : 1;
                // Минимум 1: указать 0 единиц товара в наличии нельзя
                const clamped = Math.min(Math.max(safe, 1), stock);
                return { ...prev, [productId]: clamped };
            });
        },
        [stockById]
    );

    const handleAddToBasket = useCallback(
        async (productId: number) => {
            const quantity = quantities[productId] ?? 1;
            if (quantity < 1) return;

            setBasketError(null);
            try {
                await addToBasket(productId, quantity);
                setAddedIds((prev) => new Set(prev).add(productId));
            } catch (err) {
                setBasketError(
                    err instanceof Error ? err.message : "Не удалось добавить товар в корзину"
                );
            }
        },
        [quantities]
    );

    return {
        slug,
        categoryId,
        categoryName,
        products,
        loading,
        error,
        basketError,
        addedIds,
        priceBounds,
        getQuantity,
        increaseQuantity,
        decreaseQuantity,
        setQuantity,
        handleAddToBasket
    };
};
