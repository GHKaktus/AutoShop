import { useEffect, useState } from "react";
import {
    getAdminOrders,
    updateAdminOrderStatus,
    deleteAdminOrder,
    type AdminOrder,
    type OrderStatus
} from "@/api/admin";

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Ожидает",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён"
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as OrderStatus[];

const AdminOrders = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminOrders(0);
            setOrders(data.orders);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить заказы");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleStatusChange(order: AdminOrder, status: OrderStatus) {
        setBusyId(order.id);
        try {
            const updated = await updateAdminOrderStatus(order.id, status);
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status ?? status } : o)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось обновить статус");
        } finally {
            setBusyId(null);
        }
    }

    async function handleDelete(order: AdminOrder) {
        if (!window.confirm(`Удалить заказ #${order.id}?`)) return;
        try {
            await deleteAdminOrder(order.id);
            setOrders((prev) => prev.filter((o) => o.id !== order.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить заказ");
        }
    }

    return (
        <div>
            <h2 className="text-[1.5rem] font-bold text-black2 uppercase mb-6">Заказы</h2>

            {loading ? (
                <p className="text-black2 font-medium">Загрузка...</p>
            ) : error ? (
                <p className="text-red font-medium">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-grey font-medium">Заказы не найдены.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border-2 border-grey p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div>
                                    <p className="font-bold text-black2 text-[1.125rem]">Заказ #{order.id}</p>
                                    <p className="text-grey text-[0.875rem]">
                                        {order.name} · {order.phone} · {order.email}
                                    </p>
                                    <p className="text-grey text-[0.875rem]">
                                        {new Date(order.created_at).toLocaleString("ru-RU")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-black2 text-[1.125rem]">{order.total_amount} ₽</p>
                                </div>
                            </div>

                            <ul className="text-[0.875rem] text-black2 mb-3 list-disc pl-5">
                                {order.items.map((item, idx) => (
                                    <li key={`${order.id}-${item.product_id}-${idx}`}>
                                        {item.name} × {item.quantity}
                                    </li>
                                ))}
                            </ul>

                            {order.comment && (
                                <p className="text-grey text-[0.875rem] italic mb-3">Комментарий: {order.comment}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-2">
                                    <span className="text-[0.875rem] font-medium text-black2">Статус:</span>
                                    <select
                                        value={order.status}
                                        disabled={busyId === order.id}
                                        onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                                        className="border-2 border-grey focus:border-red outline-none px-3 py-1.5 text-black2 duration-200"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                        ))}
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(order)}
                                    className="text-grey font-medium hover:text-red duration-200 cursor-pointer"
                                >
                                    Удалить заказ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
