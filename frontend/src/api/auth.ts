import { apiFetch } from "@/utils/api";

export interface AuthResponse {
    token: string;
}

// POST /auth/sign-up — регистрация, возвращает JWT
export function signUp(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

// POST /auth/sign-in — авторизация, возвращает JWT
export function signIn(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

// POST /auth/logout — выход, аннулирует текущий токен (требует JWT)
export function logout(): Promise<void> {
    return apiFetch<void>("/auth/logout", { method: "POST" });
}
