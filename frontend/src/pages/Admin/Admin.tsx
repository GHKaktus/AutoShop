import { Navigate, NavLink, Route, Routes, Link } from "react-router-dom";
import { ADMIN_ROUTE, BASE_ROUTE, LOGIN_ROUTE } from "@/utils/consts";
import { useAdminAccess } from "./hooks";
import AdminProducts from "./sections/AdminProducts";
import AdminCategories from "./sections/AdminCategories";
import AdminOrders from "./sections/AdminOrders";
import AdminUsers from "./sections/AdminUsers";

const navItems = [
    { to: ADMIN_ROUTE, label: "Товары", end: true },
    { to: `${ADMIN_ROUTE}/categories`, label: "Категории", end: false },
    { to: `${ADMIN_ROUTE}/orders`, label: "Заказы", end: false },
    { to: `${ADMIN_ROUTE}/users`, label: "Пользователи", end: false }
];

const Admin = () => {
    const access = useAdminAccess();

    if (access === "unauthorized") {
        return <Navigate to={LOGIN_ROUTE} replace />;
    }

    if (access === "checking") {
        return (
            <div className="mt-[78px] md:mt-[100px] min-h-screen flex items-center justify-center bg-[#EDEDED]">
                <p className="text-[1.25rem] font-medium text-black2">Проверка доступа...</p>
            </div>
        );
    }

    if (access === "denied") {
        return (
            <div className="mt-[78px] md:mt-[100px] min-h-screen flex flex-col items-center justify-center gap-y-4 bg-[#EDEDED] px-4 text-center">
                <h2 className="text-[1.75rem] font-bold text-black2 uppercase">Доступ запрещён</h2>
                <p className="text-grey font-medium max-w-[420px]">
                    Этот раздел доступен только администраторам.
                </p>
                <Link to={BASE_ROUTE} className="text-red font-medium hover:underline">
                    Вернуться на главную
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-[78px] md:mt-[100px] min-h-screen bg-[#EDEDED]">
            <div className="container py-10 md:py-14">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-black2 uppercase mb-8">
                    Панель администратора
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="lg:w-[240px] shrink-0">
                        <nav className="bg-white border-4 border-grey flex flex-row flex-wrap lg:flex-col">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `px-5 py-4 font-medium uppercase text-[0.875rem] duration-200 border-b-2 border-grey/30 ${
                                            isActive
                                                ? "bg-red text-white"
                                                : "text-black2 hover:bg-grey/10"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1 min-w-0 bg-white border-4 border-grey p-5 md:p-7">
                        <Routes>
                            <Route index element={<AdminProducts />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="*" element={<Navigate to={ADMIN_ROUTE} replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Admin;
