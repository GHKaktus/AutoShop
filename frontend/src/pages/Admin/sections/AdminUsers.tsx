import { useEffect, useState } from "react";
import {
    getAdminUsers,
    updateUserRole,
    type AdminUser,
    type UserRole
} from "@/api/admin";

const ROLE_LABELS: Record<UserRole, string> = {
    user: "Пользователь",
    admin: "Администратор"
};

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as UserRole[];

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminUsers(0);
            setUsers(data.users);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить пользователей");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleRoleChange(user: AdminUser, role: UserRole) {
        setBusyId(user.id);
        try {
            const updated = await updateUserRole(user.id, role);
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: updated.role ?? role } : u)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось изменить роль");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div>
            <h2 className="text-[1.5rem] font-bold text-black2 uppercase mb-6">Пользователи</h2>

            {loading ? (
                <p className="text-black2 font-medium">Загрузка...</p>
            ) : error ? (
                <p className="text-red font-medium">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-grey font-medium">Пользователи не найдены.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-grey text-[0.875rem] uppercase text-grey">
                                <th className="py-2 pr-3">ID</th>
                                <th className="py-2 pr-3">Email</th>
                                <th className="py-2 pr-3">Роль</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-grey/40 text-black2">
                                    <td className="py-2 pr-3">{u.id}</td>
                                    <td className="py-2 pr-3 font-medium">{u.email}</td>
                                    <td className="py-2 pr-3">
                                        <select
                                            value={u.role}
                                            disabled={busyId === u.id}
                                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                                            className="border-2 border-grey focus:border-red outline-none px-3 py-1.5 text-black2 duration-200"
                                        >
                                            {ROLE_OPTIONS.map((r) => (
                                                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
