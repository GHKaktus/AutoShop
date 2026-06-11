import { apiFetch } from "@/utils/api";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";

export type UserRole = "user" | "admin";

export interface AdminUser {
    id: number;
    email: string;
    role: UserRole;
}

export interface AdminCategory {
    id: number;
    name: string;
    description?: string | null;
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    name: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface AdminOrder {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    email: string;
    comment?: string | null;
    status: OrderStatus;
    total_amount: number;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface ProductForm {
    name: string;
    cost: number;
    sale_cost?: number;
    category_id: number;
    picture?: string;
    description?: string;
    stock?: number;
}

export interface CategoryForm {
    name: string;
    description?: string;
}

interface PageMeta {
    current_page: number;
    page_size: number;
}

export type ProductsPage = PageMeta & { total_products: number; products: Product[] };
export type OrdersPage = PageMeta & { total_orders: number; orders: AdminOrder[] };
export type UsersPage = PageMeta & { total_users: number; users: AdminUser[] };

// --- Products ---
export function getAdminProducts(page = 0): Promise<ProductsPage> {
    return apiFetch<ProductsPage>(`/admin/products?page=${page}`);
}

export function createAdminProduct(form: ProductForm): Promise<Product> {
    return apiFetch<Product>("/admin/products", {
        method: "POST",
        body: JSON.stringify(form)
    });
}

export function updateAdminProduct(id: number, form: Partial<ProductForm>): Promise<Product> {
    return apiFetch<Product>(`/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(form)
    });
}

export function deleteAdminProduct(id: number): Promise<void> {
    return apiFetch<void>(`/admin/products/${id}`, { method: "DELETE" });
}

// --- Categories ---
export function getAdminCategories(): Promise<AdminCategory[]> {
    // Список категорий доступен через публичный эндпоинт
    return apiFetch<AdminCategory[]>("/categories");
}

export function createAdminCategory(form: CategoryForm): Promise<AdminCategory> {
    return apiFetch<AdminCategory>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(form)
    });
}

export function updateAdminCategory(id: number, form: CategoryForm): Promise<AdminCategory> {
    return apiFetch<AdminCategory>(`/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(form)
    });
}

export function deleteAdminCategory(id: number): Promise<void> {
    return apiFetch<void>(`/admin/categories/${id}`, { method: "DELETE" });
}

// --- Orders ---
export function getAdminOrders(page = 0): Promise<OrdersPage> {
    return apiFetch<OrdersPage>(`/admin/orders?page=${page}`);
}

export function updateAdminOrderStatus(id: number, status: OrderStatus): Promise<AdminOrder> {
    return apiFetch<AdminOrder>(`/admin/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
    });
}

export function deleteAdminOrder(id: number): Promise<void> {
    return apiFetch<void>(`/admin/orders/${id}`, { method: "DELETE" });
}

// --- Users ---
export function getAdminUsers(page = 0): Promise<UsersPage> {
    return apiFetch<UsersPage>(`/admin/users?page=${page}`);
}

export function updateUserRole(userId: number, role: UserRole): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role })
    });
}
