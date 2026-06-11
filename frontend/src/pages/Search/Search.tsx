import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Button from "@/components/ui/Button";
import { SEARCH_ROUTE } from "@/utils/consts";
import { resolveBasketProductImage } from "@/utils/productImage";
import type { Product } from "@/pages/Catalog/CatalogProducts/types";
import { useSearch } from "./hooks";

function isOnSale(product: Product): boolean {
    return product.sale_cost >= 0 && product.sale_cost < product.cost;
}

const Search = () => {
    const navigate = useNavigate();
    const { query, products, total, loading, error } = useSearch();
    const [inputValue, setInputValue] = useState<string>(query);

    useEffect(() => {
        setInputValue(query);
    }, [query]);

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const nextQuery = inputValue.trim();
        if (!nextQuery) return;
        navigate(`${SEARCH_ROUTE}?q=${encodeURIComponent(nextQuery)}`);
    }

    const inputClasses =
        "w-full max-w-[520px] bg-white border-4 border-grey focus:border-red outline-none px-4 py-3 text-black2 placeholder:text-grey duration-200";

    return (
        <div className="mt-[78px] md:mt-[100px]">
            <BreadCrumbs />
            <section className="w-full min-h-screen bg-[#EDEDED]">
                <div className="container py-25 text-black2 leading-normal tracking-normal">
                    <h2 className="text-[2.25rem] font-bold mb-4">Поиск</h2>

                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-[640px]" role="search">
                        <input
                            type="search"
                            name="q"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Введите название товара..."
                            aria-label="Поиск по товарам"
                            className={inputClasses}
                        />
                        <Button
                            type="submit"
                            linkTo=""
                            paddingInline="px-6"
                            paddingBlock="py-3"
                            addClasses="flex items-center justify-center hover:bg-red hover:text-white hover:rounded-md shrink-0"
                            isHover={true}
                        >
                            Найти
                        </Button>
                    </form>

                    {query
                        ? <p className="text-grey font-medium mb-10">По запросу «{query}» найдено: {total}</p>
                        : <p className="text-grey font-medium mb-10">Введите запрос в строке поиска</p>
                    }

                    {loading ? (
                        <p className="text-[1.25rem] font-medium">Поиск товаров...</p>
                    ) : error ? (
                        <p className="text-[1.25rem] font-medium text-red">{error}</p>
                    ) : query && products.length === 0 ? (
                        <p className="text-[1.25rem] font-medium">Ничего не найдено. Попробуйте изменить запрос.</p>
                    ) : (
                        <ul className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {products.map(product => {
                                const onSale = isOnSale(product);
                                const displayCost = onSale ? product.sale_cost : product.cost;
                                const inStock = product.stock > 0;

                                return (
                                    <li key={product.id} className="h-full">
                                        <div className="relative h-full w-full border-4 border-green bg-white flex flex-col px-[18px] py-[28px]">
                                            <div className="flex items-center justify-center mb-[16px]">
                                                <img src={resolveBasketProductImage(product)} alt={product.name} className="w-full h-auto" />
                                            </div>
                                            <h3 className="text-[1.25rem] font-medium uppercase mb-[16px]">{product.name}</h3>
                                            <div className="font-bold mb-[20px] mt-auto">
                                                <p className="text-[1.5rem]">{displayCost} руб.</p>
                                                {onSale && (
                                                    <p className="text-[1rem] text-grey line-through">{product.cost} руб.</p>
                                                )}
                                            </div>
                                            <Button
                                                type="link"
                                                linkTo={`/products/${product.id}`}
                                                paddingInline="px-3"
                                                paddingBlock="py-2"
                                                textClasses="text-[0.75rem]"
                                                addClasses="text-red hover:text-white h-[48px] flex items-center justify-center"
                                            >
                                                Подробнее
                                            </Button>
                                            <div className={`absolute top-0 left-full translate-x-[-100%] w-25 h-8 flex items-center justify-center text-white ${inStock ? 'bg-green' : 'bg-grey'}`}>
                                                {inStock ? "В наличии" : "Под заказ"}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="mt-12">
                        <Link to="/catalog" className="text-red font-medium hover:underline">← Вернуться в каталог</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Search;
