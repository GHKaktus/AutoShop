import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getIsAuthenticated } from "@/store/auth";
import { getAdminProducts } from "@/api/admin";
import type { ApiError } from "@/utils/api";

export type AdminAccess = "checking" | "granted" | "denied" | "unauthorized";

// Бэкенд не отдаёт текущую роль, поэтому доступ проверяем «пробой»:
// дёргаем защищённый admin-эндпоинт и смотрим на статус ответа.
export const useAdminAccess = (): AdminAccess => {
    const isAuth = useAppSelector(getIsAuthenticated);
    const [access, setAccess] = useState<AdminAccess>("checking");

    useEffect(() => {
        let cancelled = false;

        if (!isAuth) {
            setAccess("unauthorized");
            return;
        }

        setAccess("checking");
        getAdminProducts(0)
            .then(() => {
                if (!cancelled) setAccess("granted");
            })
            .catch((err: ApiError) => {
                if (cancelled) return;
                if (err.status === 401) setAccess("unauthorized");
                else setAccess("denied");
            });

        return () => {
            cancelled = true;
        };
    }, [isAuth]);

    return access;
};

// Упрощённый булев флаг для UI (например, чтобы показать ссылку на админку).
export const useIsAdmin = (): boolean => {
    const access = useAdminAccess();
    return access === "granted";
};
