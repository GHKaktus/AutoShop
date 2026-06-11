import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchBasket,
    resetBasket,
    getBasketItems,
    getBasketTotalCount,
    getBasketTotalCost
} from "@/store/basket";
import { createOrder, type OrderResponse } from "@/api/order";

export const useOffer = () => {
    const dispatch = useAppDispatch();

    const items = useAppSelector(getBasketItems);
    const totalCount = useAppSelector(getBasketTotalCount);
    const totalCost = useAppSelector(getBasketTotalCost);

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [comment, setComment] = useState<string>("");

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [result, setResult] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchBasket());
    }, [dispatch]);

    function validate(): string | null {
        if (name.trim().length < 2) return "Укажите имя (минимум 2 символа)";
        if (!/^\+?\d{10,15}$/.test(phone.trim())) return "Некорректный номер телефона";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Некорректный email";
        return null;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (items.length === 0) {
            setError("Корзина пуста — добавьте товары перед оформлением");
            return;
        }

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        try {
            const response = await createOrder({
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                comment: comment.trim() || undefined
            });
            setResult(response);
            // Корзина опустошается на сервере — синхронизируем локальное состояние
            dispatch(resetBasket());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось оформить заказ");
        } finally {
            setSubmitting(false);
        }
    }

    return {
        name,
        setName,
        phone,
        setPhone,
        email,
        setEmail,
        comment,
        setComment,
        items,
        totalCount,
        totalCost,
        submitting,
        result,
        error,
        handleSubmit
    };
};
