import { Link } from "react-router-dom";
import { BASE_ROUTE, CATALOG_ROUTE } from "@/utils/consts";
import { useHeaderDatasets } from "./hooks";
import Button from "../ui/Button";
import SearchIcon from '@assets/icons/search.svg?react';
import BasketIcon from '@assets/icons/basket.svg?react';
import ArrowRightIcon from '@assets/icons/arrow-right.svg?react';
import ProfileIcon from '@assets/icons/profile.svg?react';
import './styles.css';

const Header = () => {

    const {
        menuNavigation,
        currentOption,
        hoverOption,
        handleClick,
        handleMouseEnter,
        handleMouseLeave
    } = useHeaderDatasets();

    return (
        <header className="fixed top-0 left-0 z-100 w-full bg-transparent text-white pt-6 pb-4.5">
            <div className="container relative z-2 grid grid-cols-[132px_auto_200px_156px] gap-x-6 items-center">
                <Link to={BASE_ROUTE}>
                    <img src="/src/assets/icons/logo.svg" alt="Логотип компании" className="h-14.5 duration-200 hover:opacity-80" />
                </Link>
                <nav className="">
                    <ul className="relative top-4.5 flex items-center justify-around gap-x-3 h-14.5">
                        {
                            menuNavigation.map(element => (
                                <li key={element.id} onClick={(e) => handleClick(e, element.id)} onMouseEnter={(e) => handleMouseEnter(e, element.id)} onMouseLeave={handleMouseLeave}
                                    className={`
                                        relative h-full flex items-start cursor-pointer
                                        after:content-['']
                                        after:absolute
                                        after:top-full
                                        after:left-[50%]
                                        after:translate-x-[-50%]
                                        after:translate-y-[-100%]
                                        ${currentOption === element.id ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                                        after:h-1
                                        after:duration-200
                                        after:bg-red  
                                        
                                        before:content-['']
                                        before:absolute
                                        before:top-[-18px]
                                        before:left-0
                                        before:w-full
                                        before:h-4.5
                                        before:bg-transparent
                                    `}
                                >
                                    <Link to={element.path} className="h-full flex items-start">
                                        <div className="text-[1rem] font-medium leading-normal tracking-normal uppercase">
                                            {element.title}
                                        </div>
                                    </Link>
                                    {
                                        element.subtitles 
                                        ?
                                        <ul
                                            className={`
                                                absolute top-full left-0 w-57 duration-200 overflow-hidden 
                                                ${hoverOption === element.id ? 'h-41 z-2' : 'h-0 z-1'}
                                                flex flex-col items-start bg-transparent 
                                            `}
                                        >
                                            {
                                                element.subtitles.map(subtitle => (
                                                    <li key={subtitle.id} className="relative z-2 w-full h-10.25 border-b border-black2 text-[1rem] font-medium uppercase leading-normal tracking-normal header-link--option">
                                                        <Link to={element.path} className="h-full flex items-center justify-between gap-x-3 p-2 hover:opacity-70">
                                                            <div className="text-[0.75rem] font-normal leading-normal tracking-normal">
                                                                {subtitle.name}
                                                            </div>
                                                            <div className="header-arrow">
                                                                <ArrowRightIcon />
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                            <div className="absolute z-1 top-0 left-0 w-full h-full bg-black opacity-90">

                                            </div>
                                        </ul> 
                                        :
                                        ''
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>
                <Button type="link" linkTo="/catalog" paddingInline="px-3 md:px-5" paddingBlock="py-3">
                    Заказать звонок
                </Button>
                <ul className="flex items-center gap-x-4">
                    <li className="">
                        <button className="w-10 aspect-square flex items-center justify-center cursor-pointer hover:opacity-80" type="button" aria-label="поиск по товарам">
                            <SearchIcon />
                        </button>
                    </li>
                    <li className="">
                        <button className="w-10 aspect-square flex items-center justify-center cursor-pointer hover:opacity-80" type="button" aria-label="корзина товаров">
                            <BasketIcon />
                        </button>
                    </li>
                    <li className="">
                        <Link to={CATALOG_ROUTE} aria-label="авторизация" className="hover:opacity-80">
                            <div className="w-10 aspect-square">
                                <ProfileIcon />
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="absolute z-1 top-0 left-0 w-full h-full bg-black opacity-95">

            </div>
        </header>
    );
};

export default Header;