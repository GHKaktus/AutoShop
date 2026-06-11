import magnumImg from "@assets/images/catalog-component/products/magnum-60h-1.png";
import maslaImg from "@assets/images/catalog-component/products/masla.jpg";
import ximiyaImg from "@assets/images/catalog-component/products/ximiya.webp";
import akksesImg from "@assets/images/catalog-component/products/akkses.jpg";
import { API_BASE_URL } from "@/utils/api";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

// Запасные изображения по id категории из фронтового стора
const FALLBACK_BY_CATEGORY_ID: Record<number, string> = {
    1: magnumImg,
    2: maslaImg,
    3: ximiyaImg,
    4: akksesImg
};

const STORAGE_KEY = "productCategoryById";

// Кэш: productId → categoryId (заполняется при просмотре каталога)
const productCategoryById = new Map<number, number>(
    Object.entries(JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}")).map(
        ([id, categoryId]) => [Number(id), Number(categoryId)]
    )
);

function persistProductCategories(): void {
    sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Object.fromEntries(productCategoryById))
    );
}

export function registerProductCategory(productId: number, categoryId: number): void {
    productCategoryById.set(productId, categoryId);
    persistProductCategories();
}

export function registerProductsCategory(products: Product[], categoryId: number): void {
    for (const product of products) {
        registerProductCategory(product.id, categoryId);
    }
}

function fallbackForCategory(categoryId?: number | null): string {
    if (categoryId && FALLBACK_BY_CATEGORY_ID[categoryId]) {
        return FALLBACK_BY_CATEGORY_ID[categoryId];
    }
    return magnumImg;
}

export function resolveProductImage(
    product: Product,
    categoryId?: number | null
): string {
    if (product.picture) {
        if (product.picture.startsWith("http")) return product.picture;
        return `${API_BASE_URL}${product.picture}`;
    }

    const resolvedCategoryId = categoryId ?? productCategoryById.get(product.id);
    return fallbackForCategory(resolvedCategoryId);
}

export function resolveBasketProductImage(product: Product): string {
    return resolveProductImage(product, productCategoryById.get(product.id));
}
