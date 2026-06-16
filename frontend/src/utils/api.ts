// Базовый адрес Rails API. В dev фронтенд (Vite) и бэкенд (Rails) работают на разных
// портах, поэтому адрес берётся из переменной окружения с запасным значением для localhost.
// В проде Rails отдаёт SPA с того же origin, поэтому достаточно пустой строки.
export const API_BASE_URL: string =
    (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

export interface ApiError extends Error {
    status?: number;
}

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers: Record<string, string> = {
        Accept: "application/json",
        ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...authHeaders(),
        ...(options.headers as Record<string, string> | undefined)
    };

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (!response.ok) {
        let message = `Ошибка запроса (${response.status})`;
        try {
            const data = await response.json();
            message = data?.message ?? data?.error ?? message;
        } catch {
            // тело ответа может быть пустым или не JSON — оставляем дефолтное сообщение
        }
        const error = new Error(message) as ApiError;
        error.status = response.status;
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    // Часть эндпоинтов отвечает пустым телом (head :ok)
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
}
