import { apiFetch } from "@/utils/api";

export interface OrderForm {
    name: string;
    phone: string;
    email: string;
    comment?: string;
}

export interface OrderResponse {
    order_id: number;
    total_amount: number;
    message: string;
}

// POST /basket/order — создание заказа из корзины текущего пользователя (требует JWT)
export function createOrder(form: OrderForm): Promise<OrderResponse> {
    return apiFetch<OrderResponse>("/basket/order", {
        method: "POST",
        body: JSON.stringify(form)
    });
}
