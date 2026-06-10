import { useState } from "react";
import Button from "@/components/ui/Button";
import Welcome from "@/components/Welcome/Welcome";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import type { WelcomeInformation } from "@/components/Welcome/types";
import type { BasketItem, BasketListItems, Product } from "./types";
import CrestikIcon from "@assets/icons/basket-crestik.svg?react";

const Basket = () => {

    const [listItems, setListItems] = useState<BasketListItems>([
        {
            product: { id: 1, name: "Ноутбук Huawei MateBook 14", cost: 89999, sale_cost: 84999, picture: "/images/matebook.jpg", description: "12-е поколение Intel Core i5, 16GB RAM, 512GB SSD", stock: 5 },
            quantity: 1
        },
        {
            product: { id: 2, name: "Смартфон Xiaomi 13T", cost: 49999, sale_cost: 44999, picture: "/images/xiaomi13t.jpg", description: "120Hz AMOLED, 108MP камера, 67W зарядка", stock: 12 },
            quantity: 2
        },
        {
            product: { id: 3, name: "Наушники Sony WH-1000XM5", cost: 34999, sale_cost: 29999, picture: "/images/sony.jpg", description: "беспроводные, шумоподавление, 30ч работы", stock: 8 },
            quantity: 1
        },
        {
            product: { id: 4, name: "Монитор Samsung Odyssey G5", cost: 28999, sale_cost: 25999, picture: "/images/samsung.jpg", description: "27\", 1440p, 165Hz, 1ms", stock: 3 },
            quantity: 1
        },
        {
            product: { id: 5, name: "Клавиатура Logitech MX Keys", cost: 12999, sale_cost: 10999, picture: "/images/logitech.jpg", description: "беспроводная, подсветка, USB-C", stock: 15 },
            quantity: 1
        },
        {
            product: { id: 6, name: "Мышь Razer DeathAdder V3", cost: 7999, sale_cost: 6999, picture: "/images/razer.jpg", description: "оптическая, 30000 DPI, 59g", stock: 20 },
            quantity: 3
        },
        {
            product: { id: 7, name: "Внешний SSD Samsung T7 1TB", cost: 11999, sale_cost: 9999, picture: "/images/samsung_ssd.jpg", description: "USB 3.2 Gen 2, 1050MB/s", stock: 7 },
            quantity: 1
        },
        {
            product: { id: 8, name: "Фитнес-браслет Xiaomi Mi Band 8", cost: 3999, sale_cost: 3499, picture: "/images/miband.jpg", description: "1.62\" AMOLED, пульсометр, 5ATM", stock: 25 },
            quantity: 2
        },
        {
            product: { id: 9, name: "Роутер TP-Link Archer AX73", cost: 8499, sale_cost: 7999, picture: "/images/tplink.jpg", description: "Wi-Fi 6, 5400 Мбит/с, 8 антенн", stock: 4 },
            quantity: 1
        },
        {
            product: { id: 10, name: "Зарядная станция Baseus 100W", cost: 5499, sale_cost: 4999, picture: "/images/baseus.jpg", description: "4 порта, GaN, поддержка PPS", stock: 11 },
            quantity: 1
        },
        {
            product: { id: 11, name: "Чехол для iPhone 15 Pro", cost: 1999, sale_cost: 1499, picture: "/images/case.jpg", description: "силикон, MagSafe, чёрный", stock: 30 },
            quantity: 4
        },
        {
            product: { id: 12, name: "Игровая приставка PlayStation 5", cost: 58999, sale_cost: 54999, picture: "/images/ps5.jpg", description: "825GB SSD, DualSense, без дисковода", stock: 2 },
            quantity: 1
        },
        {
            product: { id: 13, name: "Микрофон Blue Yeti X", cost: 16999, sale_cost: 14999, picture: "/images/yeti.jpg", description: "USB, 4 капсюля, LED индикация", stock: 6 },
            quantity: 1
        },
        {
            product: { id: 14, name: "Web-камера Logitech C920", cost: 7999, sale_cost: 6999, picture: "/images/c920.jpg", description: "1080p, автофокус, два микрофона", stock: 9 },
            quantity: 2
        },
        {
            product: { id: 15, name: "Смарт-часы Apple Watch SE", cost: 26999, sale_cost: 23999, picture: "/images/applewatch.jpg", description: "GPS, 40mm, Retina", stock: 5 },
            quantity: 1
        },
        {
            product: { id: 16, name: "Блок питания Corsair RM750x", cost: 12999, sale_cost: 11999, picture: "/images/corsair.jpg", description: "750W, 80+ Gold, модульный", stock: 10 },
            quantity: 1
        },
        {
            product: { id: 17, name: "Кулер Noctua NH-D15", cost: 8999, sale_cost: 8499, picture: "/images/noctua.jpg", description: "два вентилятора, 140mm, LGA1700", stock: 4 },
            quantity: 1
        },
        {
            product: { id: 18, name: "Видеокарта RTX 4060 Ti", cost: 42999, sale_cost: 39999, picture: "/images/rtx4060.jpg", description: "8GB GDDR6, DLSS 3", stock: 1 },
            quantity: 1
        },
        {
            product: { id: 19, name: "Коврик для мыши SteelSeries QcK", cost: 2499, sale_cost: 1999, picture: "/images/qck.jpg", description: "450x400x2mm, тканевый", stock: 18 },
            quantity: 3
        },
        {
            product: { id: 20, name: "Флешка Kingston 64GB", cost: 799, sale_cost: 599, picture: "/images/kingston.jpg", description: "USB 3.2, 200MB/s чтения", stock: 40 },
            quantity: 5
        }
    ]);
    const [valueQuantityThings, setValueQuantityThings] = useState<number>(0);

    const info: WelcomeInformation = {
        title: "Черемша",
        buttonText: "Черемша",
        image: "[background:url('/src/assets/images/home-component/welcome-section/landscape.jpg')_center/cover_no-repeat]"
    };

    function handleChangeValueQuantityThings(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            const raw = Number(e.target.value.replace('/\D/g', ''));
            if (!raw) throw new Error("Введены некорректные данные!");
            setValueQuantityThings(Number(raw));
        } catch (e) {
            console.log(e);
        }
    }

    function handleClickIncreaseQuantityThings(e: React.MouseEvent<HTMLButtonElement>, id: number) {
        setValueQuantityThings(prev => prev + 1);
    }

    function handleClickDecreaseQuantityThings(e: React.MouseEvent<HTMLButtonElement>, id: number) {
        setValueQuantityThings(prev => prev - 1);
    }

    return (
        <>
            <Welcome information={info} />
            <BreadCrumbs />
            <section className="py-[88px] bg-[#EDEDED]">
                <div className="container">
                    <h2 className="text-[2.25rem] font-bold text-black mb-[48px]">
                        Корзина
                    </h2>
                    <div className="w-full border-4 border-grey bg-white">
                        {/* Здесь товары */}
                        <ul className="w-full">
                            {
                                listItems.map(el => (
                                    <li key={el.product.id}>
                                        <article
                                            className={`
                                                relative px-[32px] py-[40px] border-b-4 border-grey
                                                grid grid-cols-[156px_180px_250px_164px_250px] gap-x-[28px]
                                                place-items-center place-content-center
                                            `}
                                        >

                                            {/* Изображение товара */}
                                            <div className="w-[156px]">
                                                <img src='/src/assets/images/home-component/welcome-section/landscape.jpg' alt="" className="w-full h-auto" />
                                            </div>

                                            {/* Название товара и его наличие */}
                                            <div className="flex flex-col gap-y-2">
                                                <h3 className="font-medium text-[1.25rem] text-red">
                                                    {el.product.name}
                                                </h3>
                                                <div className="w-[100px] h-[32px] bg-green text-white text-[0.625rem] font-bold py-[12px] px-[18px] flex items-center justify-center">
                                                    В наличии
                                                </div>
                                            </div>

                                            {/* Цена по скидке и без */}
                                            <div className="flex flex-col gap-y-2 items-center">
                                                <span className="font-bold text-[2rem] text-black">{el.product.sale_cost} руб.</span>
                                                <span className="font-bold text-[1.25rem] text-grey line-through">{el.product.cost} руб.</span>
                                            </div>

                                            {/* Кнопки изменения количества товара */}
                                            <div className="flex items-center justify-between">
                                                <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] md:min-w-[40px] lg:min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-l-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickIncreaseQuantityThings(e, el.product.id)}>
                                                    +
                                                </Button>
                                                <div className="min-w-[48px] w-full h-[48px] flex items-center justify-center border-t-4 border-b-4 border-red">
                                                    <input type="text" name="quantityThings" value={valueQuantityThings} className="w-[40px] text-center" inputMode="numeric" pattern="\d*" onChange={(e) => handleChangeValueQuantityThings(e)} title='Количество товара' aria-label='Количество товара' />
                                                </div>
                                                <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] md:min-w-[40px] lg:min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-r-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClickDecreaseQuantityThings(e, el.product.id)}>
                                                    -
                                                </Button>
                                            </div>

                                            {/* Конечная цена */}
                                            <div className="font-bold text-[2rem] text-black">
                                                {
                                                    (el.product.sale_cost || el.product.sale_cost < el.product.cost)
                                                        ? <span>{el.product.sale_cost * (el.quantity + valueQuantityThings)} руб.</span>
                                                        : <span>{el.product.cost * (el.quantity + valueQuantityThings)} руб.</span>
                                                }
                                            </div>

                                            {/* Удалить товар из корзины */}
                                            <button type="button" className="absolute z-1 w-[20px] h-[20px] top-[16px] left-full -translate-x-[calc(100%+16px)] flex items-center justify-center text-grey hover:text-red duration-200">
                                                <CrestikIcon />
                                            </button>
                                        </article>
                                    </li>
                                ))
                            }
                        </ul>

                        {/* Итоговая цена и количество товаров */}
                        <div className="flex items-center justify-between gap-x-10 py-[40px] px-[32px_72px] border-b-4 border-grey">
                            <Button type="button" linkTo="" paddingInline="px-[20px]" paddingBlock="py-[12px]" textClasses="text-red" addClasses="hover:text-white hover:bg-red hover:rounded-md" isHover={true}>
                                Очистить список
                            </Button>
                            <div className="flex items-center gap-x-12.5">
                                <div className="font-bold text-[1.25rem] text-grey">
                                    <span>Итого</span>
                                    &nbsp;
                                    {
                                        listItems.length
                                    }
                                    &nbsp;
                                    <span>
                                        {
                                            listItems.length % 10 == 1
                                                ? 'товар'
                                                : (listItems.length % 10 >= 2 && listItems.length % 10 <= 4)
                                                    ? 'товара'
                                                    : 'товаров'
                                        }
                                    </span>
                                </div>
                                <div className="font-bold text-[2rem] text-black">
                                    {
                                        listItems.reduce((akkum, el) => (akkum += valueQuantityThings * el.product.cost), 0)
                                    }
                                    &nbsp;
                                    руб.
                                </div>
                            </div>
                        </div>

                        {/* Функционал с корзиной */}
                        <div className="flex items-center justify-between gap-x-10 py-[40px] px-[32px_72px] text-red">
                            <Button type="link" linkTo="/catalog" paddingInline="px-[20px]" paddingBlock="py-[12px]" addClasses="hover:text-white hover:bg-red hover:rounded-md" isHover={true}>
                                Очистить список
                            </Button>
                            <Button type="link" linkTo="/basket" paddingInline="px-[20px]" paddingBlock="py-[12px]" addClasses="hover:text-white hover:bg-red hover:rounded-md" isHover={true}>
                                Оформить заказ
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Basket;