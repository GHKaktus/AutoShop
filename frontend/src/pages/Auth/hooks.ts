import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, register, clearAuthError, getAuthLoading, getAuthError } from "@/store/auth";
import { BASE_ROUTE } from "@/utils/consts";

export type AuthMode = "login" | "register";

export const useAuthForm = (mode: AuthMode) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loading = useAppSelector(getAuthLoading);
    const serverError = useAppSelector(getAuthError);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);

    // Сбрасываем ошибки при смене режима (вход/регистрация)
    useEffect(() => {
        dispatch(clearAuthError());
        setLocalError(null);
    }, [mode, dispatch]);

    function validate(): string | null {
        if (!email.trim() || !password) return "Заполните email и пароль";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Некорректный email";
        if (password.length < 6) return "Пароль должен быть не короче 6 символов";
        if (mode === "register" && password !== confirmPassword) return "Пароли не совпадают";
        return null;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLocalError(null);

        const validationError = validate();
        if (validationError) {
            setLocalError(validationError);
            return;
        }

        const thunk = mode === "login" ? login : register;
        const result = await dispatch(thunk({ email: email.trim(), password }));

        if (thunk.fulfilled.match(result)) {
            navigate(BASE_ROUTE);
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        error: localError ?? serverError,
        handleSubmit
    };
};
