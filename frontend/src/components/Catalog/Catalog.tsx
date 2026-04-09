import { type Category } from "@/store/categories";
import Button from "@/components/ui/Button";
import { CATALOG_ROUTE } from "@/utils/consts";
import type { ComponentProps } from "./types";
import { useCatalogLogic } from "./hooks";

const Catalog = ({ information }: ComponentProps) => {

    const { categories, currentCard, handleClick } = useCatalogLogic();

    return (
        <section className="py-22 bg-home-products bg-home-products--phara">
            <div className="container flex flex-col items-center justify-start gap-y-9">
                <h2
                    className={`
                        text-[1.25rem] sm:text-[1.875rem] md:text-[2.25rem] text-black2 font-bold leading-normal tracking-normal text-center
                        relative ${information.maxWidth} w-full uppercase mb-2
                        after:content-['']
                        after:absolute
                        after:top-full
                        after:left-[50%]
                        after:translate-x-[-50%]
                        after:w-full
                        after:h-0.5
                        after:sm:h-1
                        after:bg-red    
                    `}
                >
                    {information.title}
                </h2>
                <div className="font-medium text-black2 text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] text-center leading-normal tracking-normal">
                    <p>
                        {information.description}
                    </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {
                        categories.map((element: Category) => (
                            <li key={element.id}
                                className={`
                                    flex items-center justify-center
                                    ${element.id % 2 == 0 ? 'md:justify-start' : 'md:justify-end'}
                                    w-full text-white
                                `}
                            >
                                <div className={`relative max-w-90 h-70 md:h-100 w-full bg-home-products cursor-pointer ${element.image}`} onClick={(event) => handleClick(event, element.id)}>
                                    <div
                                        className={`
                                            wfull h-full flex flex-col items-center justify-start relative z-2 duration-200
                                            ${currentCard === element.id ? '' : 'opacity-0'}
                                        `}
                                    >
                                        <div className="w-full h-[40%]"></div>
                                        <h3 className="text-[1.125rem] sm:text-[1.5rem] font-medium leading-normal tracking-normal uppercase mb-10 md:mb-14 duration-400">
                                            {element.name}
                                        </h3>
                                        <Button type="link" linkTo={CATALOG_ROUTE} paddingInline="px-3 sm:px-5" paddingBlock="py-3 sm:py-4.5" addClasses="">
                                            Заказать онлайн
                                        </Button>
                                    </div>
                                    <div
                                        className={`
                                            absolute top-0 left-0 w-full h-full duration-200
                                            ${currentCard === element.id ? 'bg-black1 opacity-80 z-1' : 'z-3'}
                                        `}
                                    >

                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </section>
    );
};

export default Catalog;