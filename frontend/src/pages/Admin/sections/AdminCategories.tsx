import { useEffect, useState } from "react";
import {
    getAdminCategories,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
    type AdminCategory
} from "@/api/admin";

const inputClasses =
    "w-full bg-white border-2 border-grey focus:border-red outline-none px-3 py-2 text-black2 placeholder:text-grey duration-200";

const AdminCategories = () => {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            setCategories(await getAdminCategories());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function startCreate() {
        setEditingId(null);
        setName("");
        setDescription("");
        setFormError(null);
        setShowForm(true);
    }

    function startEdit(category: AdminCategory) {
        setEditingId(category.id);
        setName(category.name);
        setDescription(category.description ?? "");
        setFormError(null);
        setShowForm(true);
    }

    function cancelForm() {
        setShowForm(false);
        setEditingId(null);
        setName("");
        setDescription("");
        setFormError(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);
        if (!name.trim()) {
            setFormError("Укажите название категории");
            return;
        }

        const payload = { name: name.trim(), description: description.trim() || undefined };
        setSaving(true);
        try {
            if (editingId) {
                await updateAdminCategory(editingId, payload);
            } else {
                await createAdminCategory(payload);
            }
            cancelForm();
            await load();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Не удалось сохранить категорию");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(category: AdminCategory) {
        if (!window.confirm(`Удалить категорию «${category.name}»?`)) return;
        try {
            await deleteAdminCategory(category.id);
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить категорию");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h2 className="text-[1.5rem] font-bold text-black2 uppercase">Категории</h2>
                <button
                    type="button"
                    onClick={startCreate}
                    className="bg-red text-white font-medium px-5 py-2 hover:opacity-90 duration-200 cursor-pointer"
                >
                    + Добавить категорию
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="border-2 border-grey p-4 mb-8 flex flex-col gap-4 max-w-[520px]">
                    <h3 className="font-bold text-black2 text-[1.125rem]">
                        {editingId ? "Редактирование категории" : "Новая категория"}
                    </h3>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Название</span>
                        <input className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Описание</span>
                        <textarea className={`${inputClasses} min-h-[80px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>

                    {formError && <p className="text-red font-medium">{formError}</p>}

                    <div className="flex gap-3">
                        <button type="submit" disabled={saving} className="bg-red text-white font-medium px-6 py-2 hover:opacity-90 duration-200 cursor-pointer disabled:opacity-60">
                            {saving ? "Сохранение..." : "Сохранить"}
                        </button>
                        <button type="button" onClick={cancelForm} className="border-2 border-grey text-black2 font-medium px-6 py-2 hover:bg-grey/10 duration-200 cursor-pointer">
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-black2 font-medium">Загрузка...</p>
            ) : error ? (
                <p className="text-red font-medium">{error}</p>
            ) : categories.length === 0 ? (
                <p className="text-grey font-medium">Категории не найдены.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-grey text-[0.875rem] uppercase text-grey">
                                <th className="py-2 pr-3">ID</th>
                                <th className="py-2 pr-3">Название</th>
                                <th className="py-2 pr-3">Описание</th>
                                <th className="py-2 pr-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c.id} className="border-b border-grey/40 text-black2">
                                    <td className="py-2 pr-3">{c.id}</td>
                                    <td className="py-2 pr-3 font-medium">{c.name}</td>
                                    <td className="py-2 pr-3 text-grey">{c.description || "—"}</td>
                                    <td className="py-2 pr-3">
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => startEdit(c)} className="text-red font-medium hover:underline cursor-pointer">Изменить</button>
                                            <button type="button" onClick={() => handleDelete(c)} className="text-grey font-medium hover:text-red duration-200 cursor-pointer">Удалить</button>
                                        </div>
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

export default AdminCategories;
