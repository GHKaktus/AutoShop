import Button from "@/components/ui/Button";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import ArrowRightIcon from "@assets/icons/arrow-right.svg?react";
import GridLayoutIcon from "@assets/icons/grid-layout.svg?react";
import ColLayoutIcon from "@assets/icons/flex-col-layout.svg?react";
import FilterIcon from "@assets/icons/filter-icon.svg?react";
import CheckMarkIcon from "@assets/icons/check-mark.svg?react";
import AddBasketIcon from "@assets/icons/add-basket.svg?react";
import { useMemo, useState } from "react";
import { CONTACTS_ROUTE } from "@/utils/consts";
import { resolveProductImage } from "@/utils/productImage";
import type { Product } from "./types";
import { useCatalogProducts } from "./hooks";
import { usePriceRange } from "./priceRange";
import "./style.css";

// Виды сортировки
const SORT_PRICE = 0;
const SORT_POPULARITY = 1;
const SORT_AVAILABILITY = 2;

function isOnSale(product: Product): boolean {
    return product.sale_cost >= 0 && product.sale_cost < product.cost;
}

function effectivePrice(product: Product): number {
    return isOnSale(product) ? product.sale_cost : product.cost;
}

const CatalogProducts = () => {

    const {
        slug,
        categoryId,
        categoryName,
        products,
        loading,
        error,
        basketError,
        addedIds,
        priceBounds,
        getQuantity,
        increaseQuantity,
        decreaseQuantity,
        setQuantity,
        handleAddToBasket
    } = useCatalogProducts();

    const priceRange = usePriceRange(priceBounds.min, priceBounds.max);

    const [currentView, setCurrentView] = useState<number>(0); // 0 - grid, 1 - col
    const [isActiveCostInForm, setIsActiveCostInForm] = useState<boolean>(true);
    const [isActiveStatusInForm, setIsActiveStatusInForm] = useState<boolean>(true);
    const [isActiveFilterInForm, setIsActiveFilterInForm] = useState<boolean>(true);
    const [isFilterIcon, setIsFilterIcon] = useState<boolean>(false);

    // Сортировка (живая): 0 - по цене, 1 - по популярности, 2 - по наличию
    const [sortBy, setSortBy] = useState<number>(SORT_POPULARITY);
    const [priceAsc, setPriceAsc] = useState<boolean>(true);

    // Черновик фильтра по статусу (применяется по кнопке «Показать»)
    const [statusDraft, setStatusDraft] = useState<{ inStock: boolean; onOrder: boolean }>({ inStock: false, onOrder: false });

    // Применённые фильтры
    const [appliedRange, setAppliedRange] = useState<{ start: number; end: number } | null>(null);
    const [appliedStatus, setAppliedStatus] = useState<{ inStock: boolean; onOrder: boolean }>({ inStock: false, onOrder: false });

    const visibleProducts = useMemo(() => {
        let result = [...products];

        // Фильтр по диапазону цен
        if (appliedRange) {
            result = result.filter((product) => {
                const price = effectivePrice(product);
                return price >= appliedRange.start && price <= appliedRange.end;
            });
        }

        // Фильтр по статусу наличия (если выбран ровно один статус)
        const { inStock, onOrder } = appliedStatus;
        if (inStock && !onOrder) {
            result = result.filter((product) => product.stock > 0);
        } else if (onOrder && !inStock) {
            result = result.filter((product) => product.stock <= 0);
        }

        // Сортировка
        if (sortBy === SORT_PRICE) {
            result.sort((a, b) => priceAsc
                ? effectivePrice(a) - effectivePrice(b)
                : effectivePrice(b) - effectivePrice(a));
        } else if (sortBy === SORT_AVAILABILITY) {
            // Сначала товары в наличии, затем под заказ
            result.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0));
        }
        // SORT_POPULARITY — порядок с сервера (по умолчанию по популярности)

        return result;
    }, [products, appliedRange, appliedStatus, sortBy, priceAsc]);

    function handleClickCostInForm() {
        setIsActiveCostInForm(prev => !prev);
    }

    function handleClickStatusInForm() {
        setIsActiveStatusInForm(prev => !prev);
    }

    function handleClickFilterInForm() {
        setIsActiveFilterInForm(prev => !prev);
    }

    // Выбор сортировки: повторный клик по «цене» меняет направление
    function handleSelectSort(id: number) {
        if (id === SORT_PRICE && sortBy === SORT_PRICE) {
            setPriceAsc(prev => !prev);
            return;
        }
        setSortBy(id);
    }

    function handleClickOnButtonView(id: number) {
        setCurrentView(id);
    }

    function handleClickOnButtonFilterIcon() {
        setIsFilterIcon(prev => !prev);
    }

    function handleToggleStatus(key: "inStock" | "onOrder") {
        setStatusDraft(prev => ({ ...prev, [key]: !prev[key] }));
    }

    // «Показать» — применяем диапазон цен и фильтр по статусу
    function handleApply() {
        setAppliedRange({ start: priceRange.start, end: priceRange.end });
        setAppliedStatus(statusDraft);
    }

    // «Сбросить» — сбрасываем все параметры и сортировку
    function handleReset() {
        priceRange.reset();
        setAppliedRange(null);
        setStatusDraft({ inStock: false, onOrder: false });
        setAppliedStatus({ inStock: false, onOrder: false });
        setSortBy(SORT_POPULARITY);
        setPriceAsc(true);
    }

    return (
        <div className="mt-[78px] md:mt-[100px]">
            <BreadCrumbs />
            <section className="w-full min-h-screen bg-[#EDEDED]">
                <div className={`container py-25 text-black2 leading-normal tracking-normal`}>
                    <h2 className="text-[2.25rem] font-bold mb-14">
                        {categoryName || "Каталог"}
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
                            onSubmit={(e) => e.preventDefault()}
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
                                    <div className={`flex flex-col gap-y-10 px-3 bg-[#2D2D2D] ${isActiveCostInForm ? 'h-40 py-5' : 'h-0'} overflow-hidden duration-200`}>
                                        <div className="text-black flex items-center gap-x-3" aria-label="Информация о ценах">
                                            <input
                                                type="text"
                                                className="w-full bg-white border-4 border-black2 pl-2 py-1 placeholder:text-[0.6rem]"
                                                value={priceRange.start}
                                                name="startCostInForm"
                                                inputMode="numeric"
                                                pattern="\d*"
                                                onChange={(e) => priceRange.setStartValue(Number(e.target.value.replace(/\D/g, "")))}
                                                placeholder="Начальная цена..."
                                                title="Начальная цена"
                                                aria-label="Начальная цена"
                                            />
                                            <input
                                                type="text"
                                                className="w-full bg-white border-4 border-black2 pl-2 py-1 placeholder:text-[0.6rem]"
                                                value={priceRange.end}
                                                name="endCostInForm"
                                                inputMode="numeric"
                                                pattern="\d*"
                                                onChange={(e) => priceRange.setEndValue(Number(e.target.value.replace(/\D/g, "")))}
                                                placeholder="Конечная цена..."
                                                title="Конечная цена"
                                                aria-label="Конечная цена"
                                            />
                                        </div>
                                        {/* Двойной ползунок диапазона цен */}
                                        <div
                                            ref={priceRange.trackRef}
                                            onPointerDown={priceRange.trackHandlers.onPointerDown}
                                            onPointerMove={priceRange.trackHandlers.onPointerMove}
                                            onPointerUp={priceRange.trackHandlers.onPointerUp}
                                            className={`relative w-full h-2 bg-black2 select-none touch-none ${priceRange.enabled ? 'cursor-pointer' : 'opacity-50'}`}
                                            aria-label="Диапазон цен"
                                        >
                                            {/* Выбранный отрезок */}
                                            <div
                                                className="absolute top-0 h-full bg-red pointer-events-none"
                                                style={{ left: `${priceRange.startPercent}%`, width: `${priceRange.endPercent - priceRange.startPercent}%` }}
                                                aria-hidden="true"
                                            ></div>
                                            {/* Левый ползунок */}
                                            <div
                                                role="slider"
                                                tabIndex={priceRange.enabled ? 0 : -1}
                                                aria-label="Минимальная цена"
                                                aria-valuemin={priceRange.min}
                                                aria-valuemax={priceRange.max}
                                                aria-valuenow={priceRange.start}
                                                onKeyDown={(e) => {
                                                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); priceRange.nudge("start", -1); }
                                                    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); priceRange.nudge("start", 1); }
                                                }}
                                                style={{ left: `${priceRange.startPercent}%` }}
                                                className="absolute top-[50%] -translate-x-[50%] -translate-y-[50%] z-2 w-4 h-7 rounded-[3px] bg-white border-2 border-red shadow-md pointer-events-none"
                                            ></div>
                                            {/* Правый ползунок */}
                                            <div
                                                role="slider"
                                                tabIndex={priceRange.enabled ? 0 : -1}
                                                aria-label="Максимальная цена"
                                                aria-valuemin={priceRange.min}
                                                aria-valuemax={priceRange.max}
                                                aria-valuenow={priceRange.end}
                                                onKeyDown={(e) => {
                                                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); priceRange.nudge("end", -1); }
                                                    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); priceRange.nudge("end", 1); }
                                                }}
                                                style={{ left: `${priceRange.endPercent}%` }}
                                                className="absolute top-[50%] -translate-x-[50%] -translate-y-[50%] z-2 w-4 h-7 rounded-[3px] bg-white border-2 border-red shadow-md pointer-events-none"
                                            ></div>
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
                                            <label htmlFor="isPresent" className="cursor-pointer">В наличии</label>
                                            <input type="checkbox" id="isPresent" className="w-6 aspect-square cursor-pointer" name="isPresent" checked={statusDraft.inStock} onChange={() => handleToggleStatus("inStock")} />
                                        </div>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="onOrder" className="cursor-pointer">Под заказ</label>
                                            <input type="checkbox" id="onOrder" className="w-6 aspect-square cursor-pointer" name="onOrder" checked={statusDraft.onOrder} onChange={() => handleToggleStatus("onOrder")} />
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
                                            <label htmlFor="sortingWorth" className="cursor-pointer">По цене{sortBy === SORT_PRICE ? (priceAsc ? " ↑" : " ↓") : ""}</label>
                                            <input type="checkbox" id="sortingWorth" className="w-6 aspect-square cursor-pointer" name="sortingWorth" checked={sortBy === SORT_PRICE} onChange={() => handleSelectSort(SORT_PRICE)} />
                                        </div>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="sortingPopular" className="cursor-pointer">По популярности</label>
                                            <input type="checkbox" id="sortingPopular" className="w-6 aspect-square cursor-pointer" name="sortingPopular" checked={sortBy === SORT_POPULARITY} onChange={() => handleSelectSort(SORT_POPULARITY)} />
                                        </div>
                                        <div className="flex flex-row-reverse items-center justify-end gap-x-2">
                                            <label htmlFor="sortingAvailable" className="cursor-pointer">По наличию</label>
                                            <input type="checkbox" id="sortingAvailable" className="w-6 aspect-square cursor-pointer" name="sortingAvailable" checked={sortBy === SORT_AVAILABILITY} onChange={() => handleSelectSort(SORT_AVAILABILITY)} />
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Кнопки */}
                                <div className="flex flex-col xl:flex-row items-center xl:justify-center gap-3 px-3 py-7">
                                    <Button type="button" linkTo="" paddingInline="px-5" paddingBlock="py-3" textClasses="text-[0.75rem]" onClick={handleApply}>
                                        Показать
                                    </Button>
                                    <Button type="button" linkTo="" paddingInline="px-5" paddingBlock="py-3" textClasses="text-[0.75rem]" onClick={handleReset}>
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
                                        <button type="button" className={`flex items-center gap-x-1 ${sortBy === SORT_PRICE ? 'text-red' : 'opacity-50'} hover:text-red duration-200 cursor-pointer`} onClick={() => handleSelectSort(SORT_PRICE)}>
                                            <span>По цене</span>
                                            <ArrowRightIcon className={`${sortBy === SORT_PRICE ? (priceAsc ? '-rotate-90' : 'rotate-90') : '-rotate-90'} duration-200`} />
                                        </button>
                                        <button type="button" className={`flex items-center gap-x-1 ${sortBy === SORT_POPULARITY ? 'text-red' : 'opacity-50'} hover:text-red duration-200 cursor-pointer`} onClick={() => handleSelectSort(SORT_POPULARITY)}>
                                            <span>По популярности</span>
                                            <ArrowRightIcon className={`${sortBy === SORT_POPULARITY ? 'rotate-90' : '-rotate-90'} duration-200`} />
                                        </button>
                                        <button type="button" className={`flex items-center gap-x-1 ${sortBy === SORT_AVAILABILITY ? 'text-red' : 'opacity-50'} hover:text-red duration-200 cursor-pointer`} onClick={() => handleSelectSort(SORT_AVAILABILITY)}>
                                            <span>По наличию</span>
                                            <ArrowRightIcon className={`${sortBy === SORT_AVAILABILITY ? 'rotate-90' : '-rotate-90'} duration-200`} />
                                        </button>
                                    </div>
                                </div>
                                {/* Вид */}
                                <div className="flex items-center gap-x-5">
                                    <span>Вид:</span>
                                    <div className="w-24 h-10 flex items-center justify-center">
                                        <button
                                            type="button"
                                            className={`
                                                w-[50%] h-full flex items-center justify-center border-4 
                                                border-r-0 border-red cursor-pointer duration-200
                                                ${currentView == 0 ? 'bg-red' : ''}
                                            `}
                                            onClick={() => handleClickOnButtonView(0)}
                                        >
                                            <GridLayoutIcon className={`${currentView == 0 ? 'text-white' : 'text-black2'}`} />
                                        </button>
                                        <button
                                            type="button"
                                            className={`
                                                w-[50%] h-full flex items-center justify-center border-4 
                                                border-l-0 border-red cursor-pointer duration-200
                                                ${currentView == 1 ? 'bg-red' : ''}
                                            `}
                                            onClick={() => handleClickOnButtonView(1)}
                                        >
                                            <ColLayoutIcon className={`${currentView == 1 ? 'text-white' : 'text-black2'}`} />
                                        </button>
                                    </div>
                                </div>
                                <button type="button" className={`block lg:hidden w-[40px] h-[40px] text-black hover:text-red active:text-red ${isFilterIcon ? 'text-red' : 'text-black'} duration-200`} onClick={handleClickOnButtonFilterIcon}>
                                    <FilterIcon className="w-full h-full" />
                                </button>
                            </div>

                            {basketError && (
                                <p className="mb-4 text-red font-medium">{basketError}</p>
                            )}

                            {/* Карточки товаров */}
                            <div className="w-full">
                                {loading ? (
                                    <p className="text-[1.25rem] font-medium">Загрузка товаров...</p>
                                ) : error ? (
                                    <p className="text-[1.25rem] font-medium text-red">{error}</p>
                                ) : products.length === 0 ? (
                                    <p className="text-[1.25rem] font-medium">В этой категории пока нет товаров.</p>
                                ) : visibleProducts.length === 0 ? (
                                    <p className="text-[1.25rem] font-medium">Нет товаров по выбранным параметрам.</p>
                                ) : (
                                    <ul
                                        className={`
                                            w-full grid gap-2
                                            ${currentView == 1
                                                ? 'grid-cols-1'
                                                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                                            }
                                        `}
                                    >
                                        {visibleProducts.map(product => {
                                            const quantity = getQuantity(product.id);
                                            const added = addedIds.has(product.id);
                                            const onSale = isOnSale(product);
                                            const displayCost = onSale ? product.sale_cost : product.cost;
                                            const inStock = product.stock > 0;

                                            return (
                                                <li key={product.id} className={`h-full ${currentView == 1 ? 'w-full' : ''}`}>
                                                    <div className="relative h-full w-full border-4 border-green leading-[1.2]">
                                                        <article
                                                            className={`
                                                            w-full h-full grid bg-white
                                                            ${currentView == 1
                                                                    ? 'content-start grid-cols-2 grid-rows-[15fr_40fr_15fr_15fr_15fr] md:grid-cols-[35fr_37fr_28fr] md:grid-rows-[31fr_23fr_23fr_23fr] md:gap-x-7 md:gap-y-4 px-6 md:px-10 py-6 md:py-12'
                                                                    : 'grid-cols-[10fr_1fr] grid-rows-[auto_auto_auto_1fr_auto_auto_auto] px-[18px] py-[36px_27px] gap-x-[10px]'
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
                                                                    src={resolveProductImage(product, categoryId)}
                                                                    alt={product.name}
                                                                    className="w-full h-auto"
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
                                                                <h3>{product.name}</h3>
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
                                                                <p>{product.description}</p>
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
                                                                <p className="text-[1.5rem] md:text-[2rem]">{displayCost} руб.</p>
                                                                {
                                                                    onSale
                                                                        ?
                                                                        <p className="text-[1rem] md:text-[1.25rem] text-grey line-through">{product.cost} руб.</p>
                                                                        :
                                                                        // Заглушка-строка: сохраняет высоту блока цены, чтобы кнопки во всех карточках были на одном уровне
                                                                        <p className="text-[1rem] md:text-[1.25rem] invisible" aria-hidden="true">&nbsp;</p>
                                                                }
                                                            </div>

                                                            {/* Действия: для товаров в наличии — управление количеством и корзина;
                                                                для товаров под заказ — кнопка «Заказать» (ведёт на страницу контактов) */}
                                                            {inStock ? (
                                                                <>
                                                                    <div
                                                                        className={`
                                                                            ${added ? 'hover:text-white' : 'border-none'} text-red
                                                                            ${currentView == 1
                                                                                ? 'col-start-1 col-end-2 md:col-start-3 md:col-end-4 row-start-4 row-end-5 md:row-start-2 md:row-end-3 mr-4 md:mr-0 mt-4 md:mt-0'
                                                                                : 'row-start-5 row-end-6 col-start-1 col-end-3 md:col-end-2 mb-[20px] md:max-w-[130px] lg:max-w-none'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {
                                                                            added
                                                                                ?
                                                                                <Button type='link' linkTo="/basket" textClasses="text-[0.75rem]" addClasses="h-[48px] block flex items-center justify-center" title="Перейти в корзину">
                                                                                    Перейти в корзину
                                                                                </Button>
                                                                                :
                                                                                <div className="flex items-center justify-between">
                                                                                    <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] md:min-w-[40px] lg:min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-l-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={() => increaseQuantity(product.id)} title="Увеличить количество">
                                                                                        +
                                                                                    </Button>
                                                                                    <div className="min-w-[48px] w-full h-[48px] flex items-center justify-center border-t-4 border-b-4 border-red">
                                                                                        <input type="text" name="quantityThings" value={quantity} className="w-[40px] text-center" inputMode="numeric" pattern="\d*" onChange={(e) => setQuantity(product.id, Number(e.target.value.replace(/\D/g, "")))} title='Количество товара' aria-label='Количество товара' />
                                                                                    </div>
                                                                                    <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] md:min-w-[40px] lg:min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-r-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={() => decreaseQuantity(product.id)} title="Уменьшить количество">
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
                                                                            text-red hover:text-white flex items-center justify-center ${added && 'bg-red text-white rounded-md cursor-default pointer-events-none'}
                                                                            ${currentView == 1
                                                                                ? 'col-start-2 col-end-3 md:col-start-3 md:col-end-4 row-start-4 row-end-5 md:row-start-3 md:row-end-4 ml-4 md:ml-0 mt-4 md:mt-0'
                                                                                : `row-start-6 row-end-7 col-start-1 col-end-3 md:row-start-5 md:row-end-6 md:col-start-2 mb-[20px] h-[48px] flex items-center justify-center p-[10px]
                                                                            `}
                                                                        `}
                                                                        textClasses="text-[0.75rem]"
                                                                        title={`${added ? 'Добавлен в корзину' : 'Добавить в корзину'}`}
                                                                        onClick={added ? undefined : () => handleAddToBasket(product.id)}
                                                                    >
                                                                        {
                                                                            added
                                                                                ?
                                                                                <CheckMarkIcon className="w-[15px] h-[15px]" />
                                                                                :
                                                                                currentView == 1 ? "Добавить в корзину" : <AddBasketIcon className="w-[20px] h-[20px]" />
                                                                        }
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    type="link"
                                                                    linkTo={CONTACTS_ROUTE}
                                                                    paddingInline="px-3"
                                                                    paddingBlock="py-2"
                                                                    textClasses="text-[0.75rem]"
                                                                    title="Заказать товар — связаться с компанией"
                                                                    addClasses={`
                                                                        text-red hover:text-white flex items-center justify-center w-full h-[48px]
                                                                        ${currentView == 1
                                                                            ? 'col-start-1 col-end-3 md:col-start-3 md:col-end-4 row-start-4 row-end-5 md:row-start-2 md:row-end-4 mt-4 md:mt-0'
                                                                            : 'row-start-6 row-end-7 md:row-start-5 md:row-end-6 col-start-1 col-end-3 mb-[20px]'
                                                                        }
                                                                    `}
                                                                >
                                                                    Заказать
                                                                </Button>
                                                            )}

                                                            <Button
                                                                type="link"
                                                                linkTo={`/products/${product.id}`}
                                                                linkState={{ categorySlug: slug, categoryName }}
                                                                paddingInline="px-3"
                                                                paddingBlock="py-2"
                                                                addClasses={`
                                                                    text-red hover:text-white
                                                                    h-[48px] flex items-center justify-center
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
                                                        <div className={`absolute top-0 left-full translate-x-[-100%] w-25 h-8 z-1 flex items-center justify-center ${inStock ? 'bg-green' : 'bg-grey'}`}>
                                                            {inStock ? "В наличии" : "Под заказ"}
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default CatalogProducts;
