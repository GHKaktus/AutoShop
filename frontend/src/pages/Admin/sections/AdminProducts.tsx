import { useEffect, useState } from "react";
import {
    getAdminProducts,
    getAdminCategories,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    type AdminCategory,
    type ProductForm
} from "@/api/admin";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";
import { resolveProductImage } from "@/utils/productImage";

interface FormState {
    name: string;
    cost: string;
    sale_cost: string;
    category_id: string;
    description: string;
    stock: string;
}

const emptyForm: FormState = {
    name: "",
    cost: "",
    sale_cost: "-1",
    category_id: "",
    description: "",
    stock: "0"
};

const inputClasses =
    "w-full bg-white border-2 border-grey focus:border-red outline-none px-3 py-2 text-black2 placeholder:text-grey duration-200";

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentPicture, setCurrentPicture] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    async function loadProducts() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminProducts(0);
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить товары");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
        getAdminCategories()
            .then(setCategories)
            .catch(() => setCategories([]));
    }, []);

    function setField<K extends keyof FormState>(key: K, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function startCreate() {
        setEditingId(null);
        setForm({ ...emptyForm, category_id: categories[0] ? String(categories[0].id) : "" });
        setImageFile(null);
        setCurrentPicture(null);
        setFormError(null);
        setShowForm(true);
    }

    function startEdit(product: Product) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            cost: String(product.cost),
            sale_cost: String(product.sale_cost ?? -1),
            category_id: "",
            description: product.description ?? "",
            stock: String(product.stock)
        });
        setImageFile(null);
        setCurrentPicture(product.picture ?? null);
        setFormError(null);
        setShowForm(true);
    }

    function cancelForm() {
        setEditingId(null);
        setForm(emptyForm);
        setImageFile(null);
        setCurrentPicture(null);
        setFormError(null);
        setShowForm(false);
    }

    function validate(): ProductForm | null {
        if (!form.name.trim()) {
            setFormError("Укажите название товара");
            return null;
        }
        const cost = Number(form.cost);
        if (!Number.isFinite(cost) || cost < 0) {
            setFormError("Цена должна быть числом ≥ 0");
            return null;
        }
        const stock = Number(form.stock);
        if (!Number.isInteger(stock) || stock < 0) {
            setFormError("Остаток должен быть целым числом ≥ 0");
            return null;
        }
        const saleCost = form.sale_cost.trim() === "" ? -1 : Number(form.sale_cost);
        if (!Number.isFinite(saleCost)) {
            setFormError("Скидочная цена должна быть числом (или -1)");
            return null;
        }
        const categoryId = Number(form.category_id);
        if (!editingId && (!Number.isInteger(categoryId) || categoryId <= 0)) {
            setFormError("Выберите категорию");
            return null;
        }

        const payload: ProductForm = {
            name: form.name.trim(),
            cost,
            sale_cost: saleCost,
            category_id: categoryId,
            description: form.description.trim() || undefined,
            stock
        };
        return payload;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);
        const payload = validate();
        if (!payload) return;

        setSaving(true);
        try {
            if (editingId) {
                const { category_id, ...rest } = payload;
                const update = Number.isInteger(category_id) && category_id > 0 ? payload : rest;
                await updateAdminProduct(editingId, update, imageFile);
            } else {
                await createAdminProduct(payload, imageFile);
            }
            cancelForm();
            await loadProducts();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Не удалось сохранить товар");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(product: Product) {
        if (!window.confirm(`Удалить товар «${product.name}»?`)) return;
        try {
            await deleteAdminProduct(product.id);
            await loadProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить товар");
        }
    }

    const previewProduct: Product | null = editingId
        ? {
              id: editingId,
              name: form.name,
              cost: Number(form.cost) || 0,
              sale_cost: Number(form.sale_cost) || -1,
              picture: currentPicture,
              description: form.description,
              stock: Number(form.stock) || 0
          }
        : null;

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h2 className="text-[1.5rem] font-bold text-black2 uppercase">Товары</h2>
                <button
                    type="button"
                    onClick={startCreate}
                    className="bg-red text-white font-medium px-5 py-2 hover:opacity-90 duration-200 cursor-pointer"
                >
                    + Добавить товар
                </button>
            </div>

            {showForm ? (
                <form onSubmit={handleSubmit} className="border-2 border-grey p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 font-bold text-black2 text-[1.125rem]">
                        {editingId ? "Редактирование товара" : "Новый товар"}
                    </h3>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Название</span>
                        <input className={inputClasses} value={form.name} onChange={(e) => setField("name", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Категория</span>
                        <select className={inputClasses} value={form.category_id} onChange={(e) => setField("category_id", e.target.value)}>
                            <option value="">{editingId ? "— не менять —" : "Выберите категорию"}</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Цена, руб.</span>
                        <input type="number" min={0} step="0.01" className={inputClasses} value={form.cost} onChange={(e) => setField("cost", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Скидочная цена (-1 если нет)</span>
                        <input type="number" step="0.01" className={inputClasses} value={form.sale_cost} onChange={(e) => setField("sale_cost", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">Остаток, шт.</span>
                        <input type="number" min={0} step="1" className={inputClasses} value={form.stock} onChange={(e) => setField("stock", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-y-1">
                        <span className="text-[0.875rem] font-medium text-black2">
                            Изображение товара (необязательно)
                        </span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className={inputClasses}
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                        />
                        {previewProduct && (currentPicture || imageFile) ? (
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : resolveProductImage(previewProduct)}
                                alt="Превью"
                                className="mt-2 max-h-32 w-auto object-contain border border-grey"
                            />
                        ) : null}
                    </label>
                    <label className="flex flex-col gap-y-1 md:col-span-2">
                        <span className="text-[0.875rem] font-medium text-black2">Описание</span>
                        <textarea className={`${inputClasses} min-h-[80px]`} value={form.description} onChange={(e) => setField("description", e.target.value)} />
                    </label>

                    {formError && <p className="md:col-span-2 text-red font-medium">{formError}</p>}

                    <div className="md:col-span-2 flex gap-3">
                        <button type="submit" disabled={saving} className="bg-red text-white font-medium px-6 py-2 hover:opacity-90 duration-200 cursor-pointer disabled:opacity-60">
                            {saving ? "Сохранение..." : "Сохранить"}
                        </button>
                        <button type="button" onClick={cancelForm} className="border-2 border-grey text-black2 font-medium px-6 py-2 hover:bg-grey/10 duration-200 cursor-pointer">
                            Отмена
                        </button>
                    </div>
                </form>
            ) : null}

            {loading ? (
                <p className="text-black2 font-medium">Загрузка...</p>
            ) : error ? (
                <p className="text-red font-medium">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-grey font-medium">Товары не найдены.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-grey text-[0.875rem] uppercase text-grey">
                                <th className="py-2 pr-3">ID</th>
                                <th className="py-2 pr-3">Название</th>
                                <th className="py-2 pr-3">Цена</th>
                                <th className="py-2 pr-3">Скидка</th>
                                <th className="py-2 pr-3">Остаток</th>
                                <th className="py-2 pr-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-b border-grey/40 text-black2">
                                    <td className="py-2 pr-3">{p.id}</td>
                                    <td className="py-2 pr-3 font-medium">{p.name}</td>
                                    <td className="py-2 pr-3">{p.cost} ₽</td>
                                    <td className="py-2 pr-3">{p.sale_cost >= 0 ? `${p.sale_cost} ₽` : "—"}</td>
                                    <td className="py-2 pr-3">{p.stock}</td>
                                    <td className="py-2 pr-3">
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => startEdit(p)} className="text-red font-medium hover:underline cursor-pointer">Изменить</button>
                                            <button type="button" onClick={() => handleDelete(p)} className="text-grey font-medium hover:text-red duration-200 cursor-pointer">Удалить</button>
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

export default AdminProducts;
