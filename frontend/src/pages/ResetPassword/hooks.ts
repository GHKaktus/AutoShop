import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth";
import { forgotPassword, resetPassword } from "@/api/auth";
import { BASE_ROUTE } from "@/utils/consts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ResetStep = "request" | "reset";

export const useResetPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState<ResetStep>("request");
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    async function handleRequestCode(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (!EMAIL_REGEX.test(email.trim())) {
            setError("Введите корректный email");
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(email.trim());
            setInfo(response.message || "Код восстановления отправлен на вашу почту");
            setStep("reset");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось отправить код");
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!code.trim()) {
            setError("Введите код из письма");
            return;
        }
        if (password.length < 6) {
            setError("Пароль должен быть не короче 6 символов");
            return;
        }
        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        setLoading(true);
        try {
            const data = await resetPassword(email.trim(), code.trim(), password);
            // Автовход: бэкенд возвращает JWT после успешного сброса
            dispatch(setCredentials({ token: data.token, email: email.trim() }));
            navigate(BASE_ROUTE);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось изменить пароль");
        } finally {
            setLoading(false);
        }
    }

    function backToRequest() {
        setStep("request");
        setError(null);
        setInfo(null);
    }

    return {
        step,
        email, setEmail,
        code, setCode,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading, error, info,
        handleRequestCode,
        handleResetPassword,
        backToRequest
    };
};
