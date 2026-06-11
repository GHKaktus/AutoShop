import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";
import type { BreadCrumbsList } from "@/components/BreadCrumbs/types";
import { getProduct } from "@/api/products";
import { addToBasket } from "@/api/basket";
import { CATALOG_ROUTE } from "@/utils/consts";
import { useAppSelector } from "@/store/hooks";
import { getCategoryBySlug } from "@/store/categories";
import { registerProductCategory } from "@/utils/productImage";

interface ProductLocationState {
    categorySlug?: string;
    categoryName?: string;
}

export const useProduct = () => {
    const { id = "" } = useParams<{ id: string }>();
    const location = useLocation();
    const state = (location.state ?? null) as ProductLocationState | null;
    const category = useAppSelector(getCategoryBySlug(state?.categorySlug ?? ""));
    const categoryId = category?.id ?? null;

    const productId = Number(id);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [quantity, setQuantityState] = useState<number>(1);
    const [added, setAdded] = useState<boolean>(false);
    const [basketError, setBasketError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!Number.isFinite(productId) || productId <= 0) {
                setError("Некорректный идентификатор товара");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await getProduct(productId);
                if (cancelled) return;
                setProduct(data);
                if (categoryId) registerProductCategory(data.id, categoryId);
                setQuantityState(1);
                setAdded(false);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Не удалось загрузить товар");
                setProduct(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [productId, categoryId]);

    const maxStock = product?.stock ?? 1;

    const increase = useCallback(() => {
        setQuantityState((prev) => Math.min(prev + 1, Math.max(maxStock, 1)));
    }, [maxStock]);

    const decrease = useCallback(() => {
        // Количество товара в наличии не может быть меньше 1
        setQuantityState((prev) => Math.max(prev - 1, 1));
    }, []);

    const setQuantity = useCallback((value: number) => {
        const safe = Number.isFinite(value) ? Math.floor(value) : 1;
        setQuantityState(Math.min(Math.max(safe, 1), Math.max(maxStock, 1)));
    }, [maxStock]);

    const handleAddToBasket = useCallback(async () => {
        if (!product || quantity < 1) return;
        setBasketError(null);
        try {
            await addToBasket(product.id, quantity);
            setAdded(true);
        } catch (err) {
            setBasketError(err instanceof Error ? err.message : "Не удалось добавить товар в корзину");
        }
    }, [product, quantity]);

    // Хлебные крошки: Главная → Каталог → Категория → Название товара
    const breadCrumbs = useMemo<BreadCrumbsList>(() => {
        const items: BreadCrumbsList = [
            { id: 1, title: "Каталог", path: CATALOG_ROUTE, isLink: true }
        ];

        if (state?.categorySlug && state?.categoryName) {
            items.push({
                id: 2,
                title: state.categoryName,
                path: `${CATALOG_ROUTE}/${state.categorySlug}`,
                isLink: true
            });
        }

        items.push({
            id: 3,
            title: product?.name ?? "Товар",
            path: location.pathname,
            isLink: false
        });

        return items;
    }, [state, product, location.pathname]);

    return {
        product,
        categoryId,
        loading,
        error,
        quantity,
        added,
        basketError,
        increase,
        decrease,
        setQuantity,
        handleAddToBasket,
        breadCrumbs
    };
};
