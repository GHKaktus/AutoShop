import { Link } from "react-router-dom";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Button from "@/components/ui/Button";
import { LOGIN_ROUTE } from "@/utils/consts";
import { useResetPassword } from "./hooks";

const ResetPassword = () => {
    const {
        step,
        email, setEmail,
        code, setCode,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading, error, info,
        handleRequestCode,
        handleResetPassword,
        backToRequest
    } = useResetPassword();

    const inputClasses =
        "w-full bg-white border-4 border-grey focus:border-red outline-none px-4 py-3 text-black2 placeholder:text-grey duration-200";

    return (
        <div className="mt-[78px] md:mt-[100px]">
            <BreadCrumbs />
            <section className="w-full min-h-screen flex items-center justify-center bg-[#EDEDED] py-[48px] md:py-[88px]">
                <div className="container flex justify-center">
                    <div className="w-full max-w-[480px] bg-white border-4 border-grey p-6 sm:p-10">
                        <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-black2 uppercase mb-2">
                            Восстановление пароля
                        </h2>
                        <p className="text-grey font-medium mb-8">
                            {step === "request"
                                ? "Укажите email — мы отправим код для сброса пароля"
                                : "Введите код из письма и новый пароль"}
                        </p>

                        {info && (
                            <p className="text-green font-medium mb-5">{info}</p>
                        )}

                        {step === "request" ? (
                            <form className="flex flex-col gap-y-5" onSubmit={handleRequestCode} noValidate>
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

                                {error && <p className="text-red font-medium">{error}</p>}

                                <div className={`mt-2 ${loading ? "opacity-60 pointer-events-none" : ""}`}>
                                    <Button
                                        type="submit"
                                        linkTo=""
                                        paddingInline="px-6"
                                        paddingBlock="py-3"
                                        addClasses="w-full flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md"
                                        isHover={true}
                                    >
                                        {loading ? "Отправка..." : "Отправить код"}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form className="flex flex-col gap-y-5" onSubmit={handleResetPassword} noValidate>
                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Код из письма</span>
                                    <input
                                        type="text"
                                        name="code"
                                        inputMode="numeric"
                                        className={inputClasses}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="123456"
                                        autoComplete="one-time-code"
                                    />
                                </label>

                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Новый пароль</span>
                                    <input
                                        type="password"
                                        name="password"
                                        className={inputClasses}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Минимум 6 символов"
                                        autoComplete="new-password"
                                    />
                                </label>

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

                                {error && <p className="text-red font-medium">{error}</p>}

                                <div className={`mt-2 ${loading ? "opacity-60 pointer-events-none" : ""}`}>
                                    <Button
                                        type="submit"
                                        linkTo=""
                                        paddingInline="px-6"
                                        paddingBlock="py-3"
                                        addClasses="w-full flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md"
                                        isHover={true}
                                    >
                                        {loading ? "Сохранение..." : "Изменить пароль"}
                                    </Button>
                                </div>

                                <button
                                    type="button"
                                    onClick={backToRequest}
                                    className="text-grey font-medium hover:text-red duration-200 cursor-pointer"
                                >
                                    Изменить email / отправить код заново
                                </button>
                            </form>
                        )}

                        <div className="mt-8 text-center text-black2">
                            <p>
                                Вспомнили пароль?{" "}
                                <Link to={LOGIN_ROUTE} className="text-red font-medium hover:underline">
                                    Войти
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;
