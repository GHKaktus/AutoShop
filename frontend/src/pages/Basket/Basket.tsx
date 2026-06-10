import Button from "@/components/ui/Button";
import Welcome from "@/components/Welcome/Welcome";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import type { WelcomeInformation } from "@/components/Welcome/types";
import CrestikIcon from "@assets/icons/basket-crestik.svg?react";
import fallbackImg from "@assets/images/catalog-component/products/magnum-60h-1.png";
import { API_BASE_URL } from "@/utils/api";
import { effectiveCost } from "@/store/basket";
import type { BasketItem } from "@/store/basket";
import { CATALOG_ROUTE, BASKET_OFFER_ROUTE } from "@/utils/consts";
import { useBasket, pluralizeProducts } from "./hooks";

const welcomeInfo: WelcomeInformation = {
    title: "Корзина",
    buttonText: "Перейти в каталог",
    image: "[background:url('/src/assets/images/home-component/welcome-section/landscape.jpg')_center/cover_no-repeat]"
};

function resolveImage(picture?: string | null): string {
    if (!picture) return fallbackImg;
    if (picture.startsWith("http")) return picture;
    return `${API_BASE_URL}${picture}`;
}

const Basket = () => {

    const {
        items,
        loading,
        error,
        totalCount,
        totalCost,
        isUpdating,
        increase,
        decrease,
        setQuantity,
        remove,
        clear
    } = useBasket();

    const isEmpty = !loading && items.length === 0;

    return (
        <>
            <Welcome information={welcomeInfo} />
            <BreadCrumbs />
            <section className="py-[48px] md:py-[88px] bg-[#EDEDED]">
                <div className="container">
                    <h2 className="text-[1.5rem] md:text-[2.25rem] font-bold text-black mb-[24px] md:mb-[48px]">
                        Корзина
                    </h2>

                    {error && (
                        <p className="mb-6 text-red font-medium">{error}</p>
                    )}

                    <div className="w-full border-4 border-grey bg-white">
                        {loading ? (
                            <p className="p-8 text-[1.25rem] font-medium text-black2">Загрузка корзины...</p>
                        ) : isEmpty ? (
                            <div className="flex flex-col items-center gap-y-6 p-8 md:p-12">
                                <p className="text-[1.25rem] font-medium text-black2 text-center">
                                    Ваша корзина пуста
                                </p>
                                <Button type="link" linkTo={CATALOG_ROUTE} paddingInline="px-[20px]" paddingBlock="py-[12px]">
                                    Перейти в каталог
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Список товаров */}
                                <ul className="w-full">
                                    {items.map((el: BasketItem) => {
                                        const onSale = effectiveCost(el.product) < el.product.cost;
                                        const lineCost = effectiveCost(el.product) * el.quantity;
                                        const updating = isUpdating(el.product.id);

                                        return (
                                            <li key={el.product.id}>
                                                <article
                                                    className={`
                                                        relative px-[20px] py-[32px] md:px-[32px] md:py-[40px] border-b-4 border-grey
                                                        flex flex-col items-center text-center gap-y-5
                                                        lg:grid lg:grid-cols-[120px_minmax(0,1fr)_auto_auto_auto] lg:items-center lg:text-left lg:gap-x-[28px] lg:gap-y-0
                                                    `}
                                                >
                                                    {/* Изображение товара */}
                                                    <div className="w-[120px] sm:w-[140px] lg:w-[120px] shrink-0">
                                                        <img src={resolveImage(el.product.picture)} alt={el.product.name} className="w-full h-auto" />
                                                    </div>

                                                    {/* Название и наличие */}
                                                    <div className="flex flex-col items-center lg:items-start gap-y-2">
                                                        <h3 className="font-medium text-[1.125rem] md:text-[1.25rem] text-red">
                                                            {el.product.name}
                                                        </h3>
                                                        <div className={`min-w-[100px] h-[32px] text-white text-[0.625rem] font-bold py-[12px] px-[18px] flex items-center justify-center ${el.product.stock > 0 ? 'bg-green' : 'bg-grey'}`}>
                                                            {el.product.stock > 0 ? "В наличии" : "Под заказ"}
                                                        </div>
                                                    </div>

                                                    {/* Цена за единицу */}
                                                    <div className="flex flex-col gap-y-1 items-center">
                                                        <span className="font-bold text-[1.5rem] md:text-[2rem] text-black">{effectiveCost(el.product)} руб.</span>
                                                        {onSale && (
                                                            <span className="font-bold text-[1rem] md:text-[1.25rem] text-grey line-through">{el.product.cost} руб.</span>
                                                        )}
                                                    </div>

                                                    {/* Управление количеством */}
                                                    <div className={`flex items-center justify-between ${updating ? 'opacity-60 pointer-events-none' : ''}`}>
                                                        <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-l-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={() => increase(el)} title="Увеличить количество">
                                                            +
                                                        </Button>
                                                        <div className="min-w-[48px] h-[48px] flex items-center justify-center border-t-4 border-b-4 border-red">
                                                            <input type="text" name="quantityThings" value={el.quantity} className="w-[40px] text-center" inputMode="numeric" pattern="\d*" onChange={(e) => setQuantity(el, Number(e.target.value.replace(/\D/g, "")))} title='Количество товара' aria-label='Количество товара' />
                                                        </div>
                                                        <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-r-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={() => decrease(el)} title="Уменьшить количество">
                                                            -
                                                        </Button>
                                                    </div>

                                                    {/* Итоговая цена по позиции */}
                                                    <div className="font-bold text-[1.5rem] md:text-[2rem] text-black lg:text-right lg:min-w-[140px]">
                                                        {lineCost} руб.
                                                    </div>

                                                    {/* Удаление товара */}
                                                    <button
                                                        type="button"
                                                        className="absolute z-1 w-[20px] h-[20px] top-[16px] right-[16px] lg:left-full lg:right-auto lg:-translate-x-[calc(100%+16px)] flex items-center justify-center text-grey hover:text-red duration-200 disabled:opacity-50"
                                                        onClick={() => remove(el.product.id)}
                                                        disabled={updating}
                                                        title="Удалить из корзины"
                                                        aria-label="Удалить из корзины"
                                                    >
                                                        <CrestikIcon />
                                                    </button>
                                                </article>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Итоги */}
                                <div className="flex flex-col gap-y-6 md:flex-row md:items-center md:justify-between gap-x-10 py-[32px] px-[20px] md:py-[40px] md:px-[32px] xl:px-[72px] border-b-4 border-grey">
                                    <Button type="button" linkTo="" paddingInline="px-[20px]" paddingBlock="py-[12px]" textClasses="text-red" addClasses="hover:text-white hover:bg-red hover:rounded-md" isHover={true} onClick={clear}>
                                        Очистить список
                                    </Button>
                                    <div className="flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-12.5">
                                        <div className="font-bold text-[1.125rem] md:text-[1.25rem] text-grey">
                                            <span>Итого</span>
                                            &nbsp;{totalCount}&nbsp;
                                            <span>{pluralizeProducts(totalCount)}</span>
                                        </div>
                                        <div className="font-bold text-[1.5rem] md:text-[2rem] text-black">
                                            {totalCost}&nbsp;руб.
                                        </div>
                                    </div>
                                </div>

                                {/* Действия */}
                                <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between gap-x-10 py-[32px] px-[20px] md:py-[40px] md:px-[32px] xl:px-[72px] text-red">
                                    <Button type="link" linkTo={CATALOG_ROUTE} paddingInline="px-[20px]" paddingBlock="py-[12px]" addClasses="hover:text-white hover:bg-red hover:rounded-md" isHover={true}>
                                        Продолжить покупки
                                    </Button>
                                    <Button type="link" linkTo={BASKET_OFFER_ROUTE} paddingInline="px-[20px]" paddingBlock="py-[12px]" addClasses="hover:text-white hover:bg-red hover:rounded-md" isHover={true}>
                                        Оформить заказ
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Basket;
