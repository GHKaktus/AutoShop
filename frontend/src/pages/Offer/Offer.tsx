import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Button from "@/components/ui/Button";
import CheckMarkIcon from "@assets/icons/check-mark.svg?react";
import { BASE_ROUTE, CATALOG_ROUTE } from "@/utils/consts";
import { pluralizeProducts } from "@/pages/Basket/hooks";
import { useOffer } from "./hooks";

const Offer = () => {
    const {
        name,
        setName,
        phone,
        setPhone,
        email,
        setEmail,
        comment,
        setComment,
        totalCount,
        totalCost,
        submitting,
        result,
        error,
        handleSubmit
    } = useOffer();

    const inputClasses =
        "w-full bg-white border-4 border-grey focus:border-red outline-none px-4 py-3 text-black2 placeholder:text-grey duration-200";

    return (
        <div className="mt-[78px] md:mt-[100px]">
            <BreadCrumbs />
            <section className="w-full min-h-screen bg-[#EDEDED] py-[48px] md:py-[88px]">
                <div className="container">
                    <h2 className="text-[1.5rem] md:text-[2.25rem] font-bold text-black2 mb-[24px] md:mb-[48px]">
                        Оформление заказа
                    </h2>

                    {result ? (
                        /* Блок успешного оформления */
                        <div className="w-full max-w-[640px] mx-auto bg-white border-4 border-green p-6 sm:p-10 flex flex-col items-center text-center gap-y-5">
                            <div className="w-16 h-16 rounded-full bg-green flex items-center justify-center text-white">
                                <CheckMarkIcon className="w-7 h-7" />
                            </div>
                            <h3 className="text-[1.5rem] md:text-[1.875rem] font-bold text-black2">
                                Заказ успешно оформлен
                            </h3>
                            <p className="text-black2 font-medium">{result.message}</p>
                            <div className="w-full flex flex-col gap-y-2 text-black2 font-medium border-t-4 border-grey pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-grey">Номер заказа</span>
                                    <span className="font-bold">№ {result.order_id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-grey">Сумма заказа</span>
                                    <span className="font-bold">{result.total_amount} руб.</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center">
                                <Button type="link" linkTo={CATALOG_ROUTE} paddingInline="px-6" paddingBlock="py-3" addClasses="flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md" isHover={true}>
                                    Продолжить покупки
                                </Button>
                                <Button type="link" linkTo={BASE_ROUTE} paddingInline="px-6" paddingBlock="py-3" addClasses="flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md" isHover={true}>
                                    На главную
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Форма данных покупателя */}
                            <form className="w-full lg:flex-1 bg-white border-4 border-grey p-6 sm:p-10 flex flex-col gap-y-5" onSubmit={handleSubmit} noValidate>
                                <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold text-black2 mb-1">
                                    Данные покупателя
                                </h3>

                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Имя</span>
                                    <input type="text" name="name" className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван" autoComplete="name" />
                                </label>

                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Телефон</span>
                                    <input type="tel" name="phone" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+79161234567" autoComplete="tel" />
                                </label>

                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Email</span>
                                    <input type="email" name="email" className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ivan@example.com" autoComplete="email" />
                                </label>

                                <label className="flex flex-col gap-y-2">
                                    <span className="font-medium text-black2">Комментарий (необязательно)</span>
                                    <textarea name="comment" className={`${inputClasses} min-h-[100px] resize-y`} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Пожелания к заказу" maxLength={500} />
                                </label>

                                {/* Блок ошибки оформления */}
                                {error && (
                                    <div className="w-full bg-white border-4 border-red p-4 text-red font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className={`mt-2 ${submitting ? "opacity-60 pointer-events-none" : ""}`}>
                                    <Button type="submit" linkTo="" paddingInline="px-6" paddingBlock="py-3" addClasses="w-full flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md" isHover={true}>
                                        {submitting ? "Оформляем..." : "Подтвердить заказ"}
                                    </Button>
                                </div>
                            </form>

                            {/* Итоги заказа */}
                            <aside className="w-full lg:w-[320px] bg-white border-4 border-grey p-6 sm:p-8 flex flex-col gap-y-4">
                                <h3 className="text-[1.25rem] md:text-[1.5rem] font-bold text-black2">
                                    Ваш заказ
                                </h3>
                                <div className="flex items-center justify-between text-black2 font-medium">
                                    <span className="text-grey">Товаров</span>
                                    <span>{totalCount}&nbsp;{pluralizeProducts(totalCount)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t-4 border-grey pt-4">
                                    <span className="text-grey font-medium">Итого</span>
                                    <span className="font-bold text-[1.5rem] text-black2">{totalCost}&nbsp;руб.</span>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Offer;
