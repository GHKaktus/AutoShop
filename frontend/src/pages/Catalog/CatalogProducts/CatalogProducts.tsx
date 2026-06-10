import Button from "@/components/ui/Button";
import Welcome from "@/components/Welcome/Welcome";
import type { WelcomeInformation } from "@/components/Welcome/types";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import ArrowRightIcon from "@assets/icons/arrow-right.svg?react";
import GridLayoutIcon from "@assets/icons/grid-layout.svg?react";
import ColLayoutIcon from "@assets/icons/flex-col-layout.svg?react";
import FilterIcon from "@assets/icons/filter-icon.svg?react";
import CheckMarkIcon from "@assets/icons/check-mark.svg?react";
import AddBasketIcon from "@assets/icons/add-basket.svg?react";
import AddedBasketIcon from "@assets/icons/added-to-basket.svg?react";
import { useState, useEffect } from "react";
import "./style.css";

const CatalogProducts = () => {

    const welcomeInfromation: WelcomeInformation = {
        title: "БомбардироКрокодило",
        buttonText: "БомбардироКрокодило"
    }

    const [currentView, setCurrentView] = useState<number>(0); // 0 - grid, 1 - col
    const [isActiveCostInForm, setIsActiveCostInForm] = useState<boolean>(true);
    const [isActiveStatusInForm, setIsActiveStatusInForm] = useState<boolean>(true);
    const [isActiveFilterInForm, setIsActiveFilterInForm] = useState<boolean>(true);
    const [currentFilterText, setCurrentFilterText] = useState<number>(0); // 0 - по цене, 1 - по популярности, 2 - по наличию
    const [isFilterIcon, setIsFilterIcon] = useState<boolean>(false);
    const [startCostInForm, setStartCostInForm] = useState<number>(0);
    const [endCostInForm, setEndCostInForm] = useState<number>(0);
    const [moveLeftToddler, setMoveLeftToddler] = useState<number>(0);
    const [moveRightToddler, setMoveRightToddler] = useState<number>(0);
    const [isAddedThing, setIsAddedThing] = useState<boolean>(false);
    const [valueQuantityThings, setValueQuantityThings] = useState<number>(0);
    const [increaseQuantityThings, setIncreaseQuantityThings] = useState<number>(0);
    const [decreaseQuantityThings, setDecreaseQuantityThings] = useState<number>(0);

    const offsetLeftToddler = `calc(0%+${moveLeftToddler}px)`;
    const offsetRightToddler = `calc(-100%-${moveRightToddler}px]`;

    interface CardAdditionalInfo {
        capacity: {
            title: string;
            data: number;
        };
        startingCurrent: {
            title: string;
            data: number;
        };
        Polarity: {
            title: string;
            data: string;
        };
        Terminals?: {
            title: string;
            data: string;
        };
        Dimensions?: {
            title: string;
            data: string;
        };
        Manufacturer?: {
            title: string;
            data: string;
        };
    }

    interface Card {
        id: number;
        title: string;
        worth: number;
        comment: string;
        image?: string;
        additional: CardAdditionalInfo;
    }

    const cards: Card[] = [
        { id: 1, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 2, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 3, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 4, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 5, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 6, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 7, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 8, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 9, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 10, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 11, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 12, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 13, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 14, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 15, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 16, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 17, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 18, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 19, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } },
        { id: 20, title: "Magnum 60h", worth: 2200, comment: "Цена действительна при сдаче старого аккумулятора аналогичной емкости в лом", additional: { capacity: { title: 'Емкость, Ач', data: 60 }, startingCurrent: { title: 'Пусковой ток, А', data: 500 }, Polarity: { title: "", data: "" } } }
    ];

    function handleClickCostInForm() {
        setIsActiveCostInForm(prev => !prev);
    }

    function handleChangeStartCostInForm(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            const raw = Number(e.target.value.replace('/\D/g', ''));
            if (!raw) throw new Error("Введены некорректные данные!");
            setStartCostInForm(Number(raw));
        } catch (e) {
            console.log(e);
        }
    }

    function handleChangeEndCostInForm(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            const raw = Number(e.target.value.replace('/\D/g', ''));
            if (!raw) throw new Error("Введены некорректные данные!");
            setEndCostInForm(Number(raw));
        } catch (e) {
            console.log(e);
        }
    }

    function handleClickStatusInForm() {
        setIsActiveStatusInForm(prev => !prev);
    }

    function handleClickFilterInForm() {
        setIsActiveFilterInForm(prev => !prev);
    }

    function handleClickOnButtonFilterText(_: React.MouseEvent<HTMLButtonElement>, id: number) {
        setCurrentFilterText(id);
    }

    function handleClickOnButtonView(_: React.MouseEvent<HTMLButtonElement>, id: number) {
        setCurrentView(id);
    }

    function handleClickOnButtonFilterIcon() {
        const scroll = window.scrollY;
        setIsFilterIcon(prev => !prev);
    }

    function handleClickAddThingToBasket() {
        setIsAddedThing(prev => !prev);
    }

    function handleChangeValueQuantityThings(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            const raw = Number(e.target.value.replace('/\D/g', ''));
            if (!raw) throw new Error("Введены некорректные данные!");
            setValueQuantityThings(Number(raw));
        } catch (e) {
            console.log(e);
        }
    }

    function handleClickIncreaseQuantityThings() {
        setIncreaseQuantityThings(prev => prev + 1);
        setValueQuantityThings(prev => prev + 1);
        setDecreaseQuantityThings(valueQuantityThings + 1);
    }

    function handleClickDecreaseQuantityThings() {
        setDecreaseQuantityThings(prev => prev - 1);
        setValueQuantityThings(prev => prev - 1);
        setIncreaseQuantityThings(valueQuantityThings - 1);
    }

    return (
        <div className="mt-[78px] md:mt-[100px]">
            {/* <Welcome information={welcomeInfromation} /> */}
            <BreadCrumbs />
            <section className="w-full min-h-screen bg-[#EDEDED]">
                <div className={`container py-25 text-black2 leading-normal tracking-normal`}>
                    <h2 className="text-[2.25rem] font-bold mb-14">
                        Какой-то заголовок!
                    </h2>
                    <div className="flex items-start justify-between gap-x-4">
                        {/* ПОДБОР ПАРАМЕТРОВ */}
                        <form
                            className={`
                                fixed top-0 left-0 lg:static
                                w-screen h-screen lg:w-full lg:max-w-50 xl:max-w-66 lg:h-auto 
                                text-white font-bold uppercase bg-black lg:translate-x-0
                                ${isFilterIcon ? 'z-101 translate-x-0' : 'translate-x-full'} duration-400  
                            `}
                        >
                            <h3 className="text-[1rem] px-4 md:px-2 py-3">
                                Параметры
                            </h3>
                            <div className="w-full">
                                {/* Цена */}
                                <fieldset>
                                    <legend className="text-[0.875rem] w-full p-2 flex items-center justify-between border-b-2 border-black2 bg-red" role="button" tabIndex={0} onClick={handleClickCostInForm}>
                                        <span>Цена</span>
                                        <ArrowRightIcon className={`text-white duration-200 ${isActiveCostInForm ? 'rotate-90' : ''}`} />
                                    </legend>
                                    <div className={`flex flex-col gap-y-12 px-3 bg-[#2D2D2D] ${isActiveCostInForm ? 'h-40 py-5' : 'h-0'} overflow-hidden duration-200`}>
                                        <div className="text-black flex items-center gap-x-3" aria-label="Информация о ценах">
                                            <input type="text" className="w-full bg-white border-4 border-black2 pl-2 py-1 placeholder:text-[0.6rem]" value={startCostInForm} name="startCostInForm" inputMode="numeric" pattern="\d*" onChange={(e) => handleChangeStartCostInForm(e)} placeholder="Начальная цена..." title="Начальная цена" aria-label="Начальная цена" />
                                            <input type="text" className="w-full bg-white border-4 border-black2 pl-2 py-1 placeholder:text-[0.6rem]" value={endCostInForm} name="endCostInForm" inputMode="numeric" pattern="\d*" onChange={(e) => handleChangeEndCostInForm(e)} placeholder="Конечная цена..." title="Конечная цена" aria-label="Конечная цена" />
                                        </div>
                                        <div className="relative w-full h-2 bg-black2" aria-label="Основа ползунок">
                                            {/* Лево */}
                                            <div className="absolute top-0 left-0 z-1 w-[50%] h-full bg-green" aria-label="Левая полоса"></div>
                                            <div className={`absolute top-[50%] left-0 z-2 translate-y-[-50%] w-4 h-7 [background:transparent_url('/src/assets/icons/toddler.svg')_center/100%_no-repeat] cursor-pointer`} aria-label="Левый ползунок"></div>
                                            {/* Право */}
                                            <div className="absolute top-0 left-full z-1 translate-x-[-100%] w-[50%] h-full bg-red" aria-label="Правая полоса"></div>
                                            <div style={{ '--offsetRightToddler': offsetRightToddler } as React.CSSProperties} className={`rightToddler absolute top-[50%] left-full z-2 translate-x-[-100%] translate-y-[-50%] w-4 h-7 [background:transparent_url('/src/assets/icons/toddler.svg')_center/100%_no-repeat] cursor-pointer`} aria-label="Правый ползунок"></div>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Статус */}
                                <fieldset className="text-[0.875rem]">
                                    <legend className="w-full p-2 flex items-center justify-between border-b-2 border-black2 bg-red" role="button" tabIndex={0} onClick={handleClickStatusInForm}>
                                        <span>Статус</span>
                                        <ArrowRightIcon className={`text-white duration-200 ${isActiveStatusInForm ? 'rotate-90' : ''}`} />
                                    </legend>
                                    <div className={`flex flex-col items-start justify-center gap-y-6 px-3 bg-[#2D2D2D] ${isActiveStatusInForm ? 'h-31 py-5' : 'h-0 py-0'} overflow-hidden duration-200`}>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="isPresent" className="">В наличии</label>
                                            <input type="checkbox" id="isPresent" className="w-6 aspect-square" name="isPresent" />
                                        </div>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="onOrder" className="">Под заказ</label>
                                            <input type="checkbox" id="onOrder" className="w-6 aspect-square" name="onOrder" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Сортировка */}
                                <fieldset className="text-[0.875rem]">
                                    <legend className="w-full p-2 flex items-center justify-between border-b-2 border-black2 bg-red" role="button" tabIndex={0} onClick={handleClickFilterInForm}>
                                        <span>Сортировка</span>
                                        <ArrowRightIcon className={`text-white duration-200 ${isActiveFilterInForm ? 'rotate-90' : ''}`} />
                                    </legend>
                                    <div className={`flex flex-col items-start justify-center gap-y-6 px-3 bg-[#2D2D2D] ${isActiveFilterInForm ? 'h-44 py-5' : 'h-0 py-0'} overflow-hidden duration-200`}>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="sortingWorth" className="">По цене</label>
                                            <input type="checkbox" id="sortingWorth" className="w-6 aspect-square" name="sortingWorth" />
                                        </div>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="sortingPopular" className="">По популярности</label>
                                            <input type="checkbox" id="sortingPopular" className="w-6 aspect-square" name="sortingPopular" />
                                        </div>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="sortingAvailable" className="">По наличию</label>
                                            <input type="checkbox" id="sortingAvailable" className="w-6 aspect-square" name="sortingAvailable" />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Кнопки */}
                                <div className="flex flex-col xl:flex-row items-center xl:justify-center gap-3 px-3 py-7">
                                    <Button type="button" linkTo="" paddingInline="px-5" paddingBlock="py-3" textClasses="text-[0.75rem]">
                                        Показать
                                    </Button>
                                    <Button type="button" linkTo="" paddingInline="px-5" paddingBlock="py-3" textClasses="text-[0.75rem]">
                                        Сбросить
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Основной контент */}
                        <div className="w-full">
                            {/* Сортировка и вид сетки*/}
                            <div className="text-[0.875rem] lg:text-[1rem] font-medium flex flex-row lg:flex-col lg:flex-row items-start lg:items-center justify-between gap-y-5 lg:gap-x-5 mb-[20px] col-start-2 col-end-3">
                                {/* Сортировать */}
                                <div className="hidden lg:flex items-center gap-x-2 lg:gap-x-5">
                                    <span className="">Сортировать:</span>
                                    <div className="flex items-center gap-x-2">
                                        <button className={`flex items-center gap-x-1 ${currentFilterText === 0 ? 'text-red' : 'opacity-50'} hover:text-red duration-200 cursor-pointer`} onClick={(e) => handleClickOnButtonFilterText(e, 0)}>
                                            <span>По цене</span>
                                            <ArrowRightIcon className={`${currentFilterText === 0 ? 'rotate-90' : '-rotate-90'} duration-200`} />
                                        </button>
                                        <button className={`flex items-center gap-x-1 ${currentFilterText === 1 ? 'text-red' : 'opacity-50'} hover:text-red duration-200 cursor-pointer`} onClick={(e) => handleClickOnButtonFilterText(e, 1)}>
                                            <span>По популярности</span>
                                            <ArrowRightIcon className={`${currentFilterText === 1 ? 'rotate-90' : '-rotate-90'} duration-200`} />
                                        </button>
                                        <button className={`flex items-center gap-x-1 ${currentFilterText === 2 ? 'text-red' : 'opacity-50'} hover:text-red duration-200 cursor-pointer`} onClick={(e) => handleClickOnButtonFilterText(e, 2)}>
                                            <span>По наличию</span>
                                            <ArrowRightIcon className={`${currentFilterText === 2 ? 'rotate-90' : '-rotate-90'} duration-200`} />
                                        </button>
                                    </div>
                                </div>
                                {/* Вид */}
                                <div className="flex items-center gap-x-5">
                                    <span>Вид:</span>
                                    <div className="w-24 h-10 flex items-center justify-center">
                                        <button
                                            className={`
                                                w-[50%] h-full flex items-center justify-center border-4 
                                                border-r-0 border-red cursor-pointer duration-200
                                                ${currentView == 0 ? 'bg-red' : ''}
                                            `}
                                            onClick={(e) => handleClickOnButtonView(e, 0)}
                                        >
                                            <GridLayoutIcon className={`${currentView == 0 ? 'text-white' : 'text-black2'}`} />
                                        </button>
                                        <button
                                            className={`
                                                w-[50%] h-full flex items-center justify-center border-4 
                                                border-l-0 border-red cursor-pointer duration-200
                                                ${currentView == 1 ? 'bg-red' : ''}
                                            `}
                                            onClick={(e) => handleClickOnButtonView(e, 1)}
                                        >
                                            <ColLayoutIcon className={`${currentView == 1 ? 'text-white' : 'text-black2'}`} />
                                        </button>
                                    </div>
                                </div>
                                <button className={`block lg:hidden w-[40px] h-[40px] text-black hover:text-red active:text-red ${isFilterIcon ? 'text-red' : 'text-black'} duration-200`} onClick={handleClickOnButtonFilterIcon}>
                                    <FilterIcon className="w-full h-full" />
                                </button>
                            </div>

                            {/* Карточки товаров */}
                            <div className="w-full">
                                <ul
                                    className={`
                                        w-full grid gap-2
                                        ${currentView == 1
                                            ? 'grid-cols-1'
                                            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                                        }
                                    `}
                                >
                                    {cards.map(card => (
                                        <li key={card.id} className={`${currentView == 1 ? 'w-full' : ''}`}>
                                            <div className="relative w-full border-4 border-green leading-[1.2]">
                                                <article
                                                    className={`
                                                    w-full grid bg-white
                                                    ${currentView == 1
                                                            ? 'grid-cols-2 grid-rows-[15fr_40fr_15fr_15fr_15fr] md:grid-cols-[35fr_37fr_28fr] md:grid-rows-[31fr_23fr_23fr_23fr] md:gap-x-7 md:gap-y-4 px-6 md:px-10 py-6 md:py-12'
                                                            : 'grid-cols-[10fr_1fr] px-[18px] py-[36px_27px] gap-x-[10px]'
                                                        }
                                                `}
                                                >
                                                    {/* Изображение */}
                                                    <div
                                                        className={`
                                                            flex items-center justify-center
                                                            ${currentView == 1
                                                                ? 'col-start-1 col-end-2 row-start-2 row-end-3 md:row-start-1 md:row-end-5'
                                                                : 'row-start-1 row-end-2 col-start-1 col-end-3 mb-[16px]'
                                                            }
                                                    `}
                                                    >
                                                        <img
                                                            src="/src/assets/images/catalog-component/products/magnum-60h-1.png"
                                                            alt="Изображение товара"
                                                            className={`
                                                            w-full h-auto
                                                        `}
                                                        />
                                                    </div>

                                                    {/* Информация */}
                                                    <div
                                                        className={`
                                                        font-medium uppercase
                                                        ${currentView == 1
                                                                ? 'col-start-1 col-end-2 md:col-start-2 md:col-end-3 row-start-1 row-end-2 flex items-center justify-center'
                                                                : 'text-[1.25rem] md:text-[1.5rem] row-start-2 row-end-3 col-start-1 col-end-3 mb-[28px]'
                                                            }
                                                    `}
                                                    >
                                                        <h3>{card.title}</h3>
                                                    </div>
                                                    <div
                                                        className={`
                                                        text-center lg:text-[0.875rem] text-grey font-medium
                                                        ${currentView == 1
                                                                ? 'col-start-1 md:col-start-2 col-end-3 row-start-3 row-end-4 md:row-start-2 md:row-end-3 flex items-center justify-center'
                                                                : 'text-[1rem] md:text-[1.10rem] md:max-w-[200px] row-start-4 row-end-5 col-start-1 col-end-3 mb-[38px] md:mb-[18px] text-left'
                                                            }
                                                    `}
                                                    >
                                                        <p>{card.comment}</p>
                                                    </div>
                                                    <div
                                                        className={`
                                                        text-[1.10rem] lg:text-[0.875rem] font-bold
                                                        ${currentView == 1
                                                                ? 'col-start-2 col-end-3 row-start-2 row-end-3 md:row-start-3 md:row-end-5 flex flex-col items-center justify-center'
                                                                : 'hidden'
                                                            }
                                                    `}
                                                    >
                                                        <p>{card.additional.capacity.title}: <span className="text-grey">{card.additional.capacity.data}</span></p>
                                                        <p>{card.additional.startingCurrent.title}: <span className="text-grey">{card.additional.startingCurrent.data}</span></p>
                                                        <p>{card.additional.startingCurrent.title}: <span className="text-grey">{card.additional.startingCurrent.data}</span></p>
                                                        <p>{card.additional.capacity.title}: <span className="text-grey">{card.additional.capacity.data}</span></p>
                                                        <p>{card.additional.startingCurrent.title}: <span className="text-grey">{card.additional.startingCurrent.data}</span></p>
                                                        <p>{card.additional.startingCurrent.title}: <span className="text-grey">{card.additional.startingCurrent.data}</span></p>
                                                    </div>
                                                    <div
                                                        className={`
                                                        font-bold
                                                        ${currentView == 1
                                                                ? 'col-start-2 col-end-3 md:col-start-3 md:col-end-4 row-start-1 row-end-2 flex flex-col items-center justify-end'
                                                                : 'row-start-3 row-end-4 col-start-1 col-end-3 mb-[12px] flex flex-col-reverse'
                                                            }
                                                    `}
                                                    >
                                                        <p className="text-[1.5rem] md:text-[2rem]">{card.worth} руб.</p>
                                                        <p className="text-[1rem] md:text-[1.25rem] text-grey line-through">{card.worth} руб.</p>
                                                    </div>
                                                    <div
                                                        className={`
                                                            ${isAddedThing ? 'hover:text-white' : 'border-none'} text-red
                                                            ${currentView == 1
                                                                ? 'col-start-1 col-end-2 md:col-start-3 md:col-end-4 row-start-4 row-end-5 md:row-start-2 md:row-end-3 mr-4 md:mr-0 mt-4 md:mt-0'
                                                                : 'row-start-5 row-end-6 col-start-1 col-end-3 md:col-end-2 mb-[20px] md:max-w-[130px] lg:max-w-none'
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            isAddedThing
                                                                ?
                                                                <Button type='link' linkTo="/basket" textClasses="text-[0.75rem]" addClasses="h-[48px] block flex items-center justify-center" title="Перейти в корзину">
                                                                    Перейти в корзину
                                                                </Button>
                                                                :
                                                                <div className="flex items-center justify-between">
                                                                    <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] md:min-w-[40px] lg:min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-l-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={handleClickIncreaseQuantityThings}>
                                                                        +
                                                                    </Button>
                                                                    <div className="min-w-[48px] w-full h-[48px] flex items-center justify-center border-t-4 border-b-4 border-red">
                                                                        <input type="text" name="quantityThings" value={valueQuantityThings} className="w-[40px] text-center" inputMode="numeric" pattern="\d*" onChange={(e) => handleChangeValueQuantityThings(e)} title='Количество товара' aria-label='Количество товара' />
                                                                    </div>
                                                                    <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] md:min-w-[40px] lg:min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-r-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={handleClickDecreaseQuantityThings}>
                                                                        -
                                                                    </Button>
                                                                </div>
                                                        }
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        linkTo=""
                                                        paddingInline="px-3"
                                                        paddingBlock="py-2"
                                                        addClasses={`
                                                            text-red hover:text-white flex items-center justify-center ${isAddedThing && 'bg-red text-white rounded-md cursor-default'}
                                                            ${currentView == 1
                                                                ? 'col-start-2 col-end-3 md:col-start-3 md:col-end-4 row-start-4 row-end-5 md:row-start-3 md:row-end-4 ml-4 md:ml-0 mt-4 md:mt-0'
                                                                : `row-start-6 row-end-7 col-start-1 col-end-3 md:row-start-5 md:row-end-6 md:col-start-2 mb-[20px] h-[48px] flex items-center justify-center p-[10px]
                                                            `}
                                                        `}
                                                        textClasses="text-[0.75rem]"
                                                        title={`${isAddedThing ? 'Добавлен в корзину' : 'Добавить в корзину'}`}
                                                        onClick={handleClickAddThingToBasket}
                                                    >
                                                        {
                                                            isAddedThing
                                                                ?
                                                                <CheckMarkIcon className="w-[15px] h-[15px]" />
                                                                :
                                                                currentView == 1 ? "Добавить в корзину" : <AddBasketIcon className="w-[20px] h-[20px]" />
                                                        }
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        linkTo=""
                                                        paddingInline="px-3"
                                                        paddingBlock="py-2"
                                                        addClasses={`
                                                            text-red hover:text-white
                                                            h-[48px]
                                                            ${currentView == 1
                                                                ? 'col-start-1 col-end-3 md:col-start-3 md:col-end-4 row-start-5 row-end-6 md:row-start-4 md:row-end-5 mt-4 md:mt-0'
                                                                : 'row-start-7 row-end-8 md:row-start-6 md:row-end-7 col-span-2'
                                                            }
                                                        `}
                                                    >
                                                        Подробнее
                                                    </Button>
                                                </article>

                                                {/* В наличии или нет */}
                                                <div className="absolute top-0 left-full translate-x-[-100%] w-25 h-8 z-1 flex items-center justify-center bg-green">
                                                    В наличии
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default CatalogProducts;