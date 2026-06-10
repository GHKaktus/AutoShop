import { Link, useLocation } from "react-router-dom";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Button from "@/components/ui/Button";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "@/utils/consts";
import { useAuthForm, type AuthMode } from "./hooks";

const Auth = () => {
    const location = useLocation();
    const mode: AuthMode = location.pathname === REGISTRATION_ROUTE ? "register" : "login";
    const isRegister = mode === "register";

    const {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        error,
        handleSubmit
    } = useAuthForm(mode);

    const inputClasses =
        "w-full bg-white border-4 border-grey focus:border-red outline-none px-4 py-3 text-black2 placeholder:text-grey duration-200";

    return (
        <div className="mt-[78px] md:mt-[100px]">
            <BreadCrumbs />
            <section className="w-full min-h-screen flex items-center justify-center bg-[#EDEDED] py-[48px] md:py-[88px]">
                <div className="container flex justify-center">
                    <div className="w-full max-w-[480px] bg-white border-4 border-grey p-6 sm:p-10">
                        <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black2 uppercase mb-2">
                            {isRegister ? "Регистрация" : "Вход"}
                        </h2>
                        <p className="text-grey font-medium mb-8">
                            {isRegister
                                ? "Создайте аккаунт, чтобы оформлять заказы"
                                : "Войдите, чтобы продолжить покупки"}
                        </p>

                        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit} noValidate>
                            <label className="flex flex-col gap-y-2">
                                <span className="font-medium text-black2">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    className={inputClasses}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    autoComplete="email"
                                />
                            </label>

                            <label className="flex flex-col gap-y-2">
                                <span className="font-medium text-black2">Пароль</span>
                                <input
                                    type="password"
                                    name="password"
                                    className={inputClasses}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Минимум 6 символов"
                                    autoComplete={isRegister ? "new-password" : "current-password"}
                                />
                            </label>

                            {isRegister && (
                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Повторите пароль</span>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className={inputClasses}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Повторите пароль"
                                        autoComplete="new-password"
                                    />
                                </label>
                            )}

                            {error && (
                                <p className="text-red font-medium">{error}</p>
                            )}

                            <div className={`mt-2 ${loading ? "opacity-60 pointer-events-none" : ""}`}>
                                <Button
                                    type="submit"
                                    linkTo=""
                                    paddingInline="px-6"
                                    paddingBlock="py-3"
                                    addClasses="w-full flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md"
                                    isHover={true}
                                >
                                    {loading
                                        ? "Подождите..."
                                        : isRegister
                                            ? "Зарегистрироваться"
                                            : "Войти"}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-black2">
                            {isRegister ? (
                                <p>
                                    Уже есть аккаунт?{" "}
                                    <Link to={LOGIN_ROUTE} className="text-red font-medium hover:underline">
                                        Войти
                                    </Link>
                                </p>
                            ) : (
                                <p>
                                    Нет аккаунта?{" "}
                                    <Link to={REGISTRATION_ROUTE} className="text-red font-medium hover:underline">
                                        Зарегистрироваться
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Auth;
