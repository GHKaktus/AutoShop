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

export interface ForgotPasswordResponse {
    message: string;
}

// POST /auth/forgot-password — отправляет код восстановления на email
export function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
    });
}

// POST /auth/reset-password — сброс пароля по коду, возвращает JWT для автовхода
export function resetPassword(email: string, code: string, newPassword: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, new_password: newPassword })
    });
}
