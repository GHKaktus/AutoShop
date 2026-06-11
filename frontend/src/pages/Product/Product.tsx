import Button from "@/components/ui/Button";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import CheckMarkIcon from "@assets/icons/check-mark.svg?react";
import { CONTACTS_ROUTE } from "@/utils/consts";
import { resolveProductImage } from "@/utils/productImage";
import type { Product as ProductType } from "@/pages/Catalog/CatalogProducts/types";
import { useProduct } from "./hooks";

function isOnSale(product: ProductType): boolean {
    return product.sale_cost >= 0 && product.sale_cost < product.cost;
}

const Product = () => {
    const {
        product,
        categoryId,
        loading,
        error,
        quantity,
        added,
        basketError,
        increase,
        decrease,
        setQuantity,
        handleAddToBasket,
        breadCrumbs
    } = useProduct();

    const onSale = product ? isOnSale(product) : false;
    const inStock = product ? product.stock > 0 : false;
    const displayCost = product ? (onSale ? product.sale_cost : product.cost) : 0;

    return (
        <div className="mt-[78px] md:mt-[100px]">
            <BreadCrumbs items={breadCrumbs} />
            <section className="w-full min-h-screen bg-[#EDEDED]">
                <div className="container py-25 text-black2 leading-normal tracking-normal">
                    {loading ? (
                        <p className="text-[1.25rem] font-medium">Загрузка товара...</p>
                    ) : error ? (
                        <div className="flex flex-col items-start gap-y-6">
                            <p className="text-[1.25rem] font-medium text-red">{error}</p>
                            <Button type="link" linkTo="/catalog" paddingInline="px-5" paddingBlock="py-3" textClasses="text-[0.875rem]">
                                Вернуться в каталог
                            </Button>
                        </div>
                    ) : product ? (
                        <div className="bg-white border-4 border-green">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 p-6 md:p-12">
                                {/* Изображение */}
                                <div className="relative flex items-start justify-center">
                                    <img src={resolveProductImage(product, categoryId)} alt={product.name} className="w-full max-w-[420px] h-auto" />
                                    <div className={`absolute top-0 left-0 w-25 h-8 flex items-center justify-center text-white text-[0.875rem] font-medium ${inStock ? 'bg-green' : 'bg-grey'}`}>
                                        {inStock ? "В наличии" : "Под заказ"}
                                    </div>
                                </div>

                                {/* Информация */}
                                <div className="flex flex-col gap-y-6">
                                    <h1 className="text-[1.75rem] md:text-[2.25rem] font-bold uppercase">{product.name}</h1>

                                    <div className="flex items-end gap-x-4">
                                        <span className="text-[2rem] md:text-[2.5rem] font-bold">{displayCost} руб.</span>
                                        {onSale && (
                                            <span className="text-[1.25rem] md:text-[1.5rem] text-grey line-through">{product.cost} руб.</span>
                                        )}
                                    </div>

                                    {/* Характеристики */}
                                    <div className="border-t-2 border-b-2 border-[#EDEDED] py-4">
                                        <h2 className="text-[1.125rem] font-bold uppercase mb-3">Характеристики</h2>
                                        <ul className="flex flex-col gap-y-2 text-[0.9375rem]">
                                            <li className="flex items-center justify-between gap-x-4">
                                                <span className="text-grey">Артикул</span>
                                                <span className="font-medium">{product.id}</span>
                                            </li>
                                            <li className="flex items-center justify-between gap-x-4">
                                                <span className="text-grey">Наличие</span>
                                                <span className="font-medium">{inStock ? "В наличии" : "Под заказ"}</span>
                                            </li>
                                            <li className="flex items-center justify-between gap-x-4">
                                                <span className="text-grey">Остаток на складе</span>
                                                <span className="font-medium">{product.stock} шт.</span>
                                            </li>
                                            <li className="flex items-center justify-between gap-x-4">
                                                <span className="text-grey">Цена</span>
                                                <span className="font-medium">{product.cost} руб.</span>
                                            </li>
                                            {onSale && (
                                                <li className="flex items-center justify-between gap-x-4">
                                                    <span className="text-grey">Цена со скидкой</span>
                                                    <span className="font-medium text-red">{product.sale_cost} руб.</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Описание */}
                                    {product.description && (
                                        <div>
                                            <h2 className="text-[1.125rem] font-bold uppercase mb-3">Описание</h2>
                                            <p className="text-[0.9375rem] text-grey leading-relaxed">{product.description}</p>
                                        </div>
                                    )}

                                    {basketError && <p className="text-red font-medium">{basketError}</p>}

                                    {/* Действия */}
                                    {inStock ? (
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                            <div className="flex items-center">
                                                <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-l-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={decrease} title="Уменьшить количество">
                                                    -
                                                </Button>
                                                <div className="min-w-[60px] h-[48px] flex items-center justify-center border-t-4 border-b-4 border-red">
                                                    <input
                                                        type="text"
                                                        name="quantity"
                                                        value={quantity}
                                                        className="w-[48px] text-center"
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        onChange={(e) => setQuantity(Number(e.target.value.replace(/\D/g, "")))}
                                                        title="Количество товара"
                                                        aria-label="Количество товара"
                                                    />
                                                </div>
                                                <Button type='button' linkTo="" paddingBlock="py-0" paddingInline="px-0" addClasses="min-w-[48px] h-[48px] hover:bg-red hover:text-white hover:rounded-r-md cursor-pointer" borderWidth="border-4" isHover={true} onClick={increase} title="Увеличить количество">
                                                    +
                                                </Button>
                                            </div>
                                            {
                                                added
                                                    ?
                                                    <Button type="link" linkTo="/basket" paddingInline="px-6" paddingBlock="py-3" textClasses="text-[0.875rem]" addClasses="bg-red text-white rounded-md flex items-center justify-center gap-x-2" title="Перейти в корзину">
                                                        <CheckMarkIcon className="w-[15px] h-[15px]" />
                                                        В корзине — перейти
                                                    </Button>
                                                    :
                                                    <Button type="button" linkTo="" paddingInline="px-6" paddingBlock="py-3" textClasses="text-[0.875rem]" addClasses="text-red hover:text-white flex items-center justify-center" onClick={handleAddToBasket} title="Добавить в корзину">
                                                        Добавить в корзину
                                                    </Button>
                                            }
                                        </div>
                                    ) : (
                                        <Button type="link" linkTo={CONTACTS_ROUTE} paddingInline="px-6" paddingBlock="py-3" textClasses="text-[0.875rem]" addClasses="text-red hover:text-white flex items-center justify-center max-w-[260px]" title="Заказать товар — связаться с компанией">
                                            Заказать
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
};

export default Product;
