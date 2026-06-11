import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";
import { searchProducts } from "@/api/search";

export const useSearch = () => {
    const [searchParams] = useSearchParams();
    const query = (searchParams.get("q") ?? "").trim();
    const paramsKey = searchParams.toString();

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (!query) {
            setProducts([]);
            setTotal(0);
            setError(null);
            setLoading(false);
            return;
        }

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const response = await searchProducts(query, 0);
                if (cancelled) return;
                setProducts(response.items);
                setTotal(response.total_items);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Не удалось выполнить поиск");
                setProducts([]);
                setTotal(0);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [query, paramsKey]);

    return { query, products, total, loading, error };
};
