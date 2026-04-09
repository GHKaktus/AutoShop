import { Link } from "react-router-dom";
import { breadCrumbs } from "./hooks";
import { BASE_ROUTE } from "@/utils/consts";
import ArrowRightIcon from "@assets/icons/arrow-right.svg?react";

const BreadCrumbs = () => {

    const breadCrumbsList = breadCrumbs();

    return (
        <section className="w-full bg-white">
            <div className="container h-13 flex items-center">
                <ul className="flex items-center justify-start gap-x-4 text-[0.75rem] font-medium uppercase leading-normal tracking-normal">
                    <li className="">
                        <Link to={BASE_ROUTE} className="text-red">
                            Главная
                        </Link>
                    </li>
                    <ArrowRightIcon className="text-red" aria-hidden='true' />
                    {
                        breadCrumbsList
                            ?
                            breadCrumbsList.map((el, index) => (
                                <>
                                    <li key={el.id} className="">
                                        {
                                            el.isLink
                                                ?
                                                <Link to={el.path} className="">
                                                    {el.title}
                                                </Link>
                                                :
                                                <div className="">
                                                    {el.title}
                                                </div>
                                        }
                                    </li>
                                    {
                                        index !== breadCrumbsList.length - 1 
                                        ? <ArrowRightIcon className="text-red" aria-hidden='true' /> 
                                        : ''
                                    }
                                </>
                            ))
                            :
                            'Пусто!'
                    }
                </ul>
            </div>
        </section>
    );
};

export default BreadCrumbs;