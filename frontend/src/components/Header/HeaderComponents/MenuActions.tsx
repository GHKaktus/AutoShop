import { Link } from "react-router-dom";
import { CATALOG_ROUTE, BASKET_ROUTE } from '@/utils/consts';
import SearchIcon from '@assets/icons/search.svg?react';
import BasketIcon from '@assets/icons/basket.svg?react';
import ProfileIcon from '@assets/icons/profile.svg?react';

interface MenuActionsProps {
    display: 'header' | 'burger';
    isHidden: boolean;
}

const MenuActions = ({ display, isHidden }:MenuActionsProps ) => {
    return (
        <ul 
            className={`
                ${isHidden && 'hidden'}
                ${
                    display === 'header'
                    ? 'flex items-center gap-x-4'
                    : 'flex flex-col items-center gap-y-[20px]'
                }
            `}
        >
            <li className="">
                <button className="w-10 aspect-square flex items-center justify-center cursor-pointer hover:opacity-80" type="button" aria-label="поиск по товарам">
                    <SearchIcon />
                </button>
            </li>
            <li className="">
                <Link to={BASKET_ROUTE} className="w-10 aspect-square flex items-center justify-center cursor-pointer hover:opacity-80" aria-label="корзина товаров">
                    <BasketIcon />
                </Link>
            </li>
            <li className="">
                <Link to={CATALOG_ROUTE} aria-label="авторизация" className="hover:opacity-80">
                    <div className="w-10 aspect-square">
                        <ProfileIcon />
                    </div>
                </Link>
            </li>
        </ul>
    );
};

export default MenuActions;