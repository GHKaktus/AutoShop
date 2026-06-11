import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SEARCH_ROUTE } from '@/utils/consts';
import SearchIcon from '@assets/icons/search.svg?react';
import BasketIcon from '@assets/icons/basket.svg?react';
import ProfileIcon from '@assets/icons/profile.svg?react';
import LogoutIcon from '@assets/icons/logout.svg?react';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getIsAuthenticated, logoutAccount } from "@/store/auth";

interface MenuActionsProps {
    display: 'header' | 'burger';
    isHidden: boolean;
}

const MenuActions = ({ display, isHidden }:MenuActionsProps ) => {
    const isAuth = useAppSelector(getIsAuthenticated);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchFormRef = useRef<HTMLFormElement>(null);

    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Подтягиваем текущий запрос из URL, чтобы повторный поиск начинался с актуального текста
    useEffect(() => {
        if (location.pathname === SEARCH_ROUTE) {
            setSearchQuery(searchParams.get("q") ?? "");
        }
    }, [location.pathname, searchParams]);

    // При уходе со страницы поиска сворачиваем строку ввода — открыть снова можно по лупе
    useEffect(() => {
        if (location.pathname !== SEARCH_ROUTE) {
            setIsSearchOpen(false);
        }
    }, [location.pathname]);

    // Закрываем поле поиска при клике вне формы поиска
    useEffect(() => {
        if (!isSearchOpen) return;

        function handleOutsideClick(event: MouseEvent) {
            if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isSearchOpen]);

    async function handleLogout() {
        await dispatch(logoutAccount());
        navigate(BASE_ROUTE);
    }

    function openSearchInput() {
        setIsSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
    }

    // Клик по лупе переключает видимость строки поиска
    function toggleSearchInput() {
        if (isSearchOpen) {
            setIsSearchOpen(false);
            return;
        }
        openSearchInput();
    }

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const query = searchQuery.trim();
        if (!query) {
            openSearchInput();
            return;
        }
        navigate(`${SEARCH_ROUTE}?q=${encodeURIComponent(query)}`);
        // Поле остаётся доступным для следующего запроса
        openSearchInput();
    }

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
                {/* Поиск: иконка раскрывает строку ввода, отправка ведёт на /search?q= */}
                <form ref={searchFormRef} onSubmit={handleSearchSubmit} className="flex items-center gap-x-2" role="search">
                    <input
                        ref={searchInputRef}
                        type="search"
                        name="q"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск товаров..."
                        aria-label="Поиск по товарам"
                        className={`
                            bg-white text-black2 placeholder:text-grey rounded-md outline-none duration-300
                            ${isSearchOpen
                                ? 'w-40 md:w-48 px-3 py-2 border-2 border-red opacity-100'
                                : 'w-0 p-0 border-0 opacity-0 pointer-events-none'
                            }
                        `}
                    />
                    <button
                        className="w-10 aspect-square flex items-center justify-center cursor-pointer hover:opacity-80"
                        type="button"
                        aria-label="поиск по товарам"
                        onClick={toggleSearchInput}
                    >
                        <SearchIcon />
                    </button>
                </form>
            </li>
            <li className="">
                <Link to={BASKET_ROUTE} className="w-10 aspect-square flex items-center justify-center cursor-pointer hover:opacity-80" aria-label="корзина товаров">
                    <BasketIcon />
                </Link>
            </li>
            <li className="">
                {/* Авторизован — кнопка профиля заменяется на кнопку выхода;
                    не авторизован — иконка профиля ведёт на страницу входа */}
                {
                    isAuth
                        ?
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label="выйти из аккаунта"
                            title="Выйти из аккаунта"
                            className="w-10 aspect-square flex items-center justify-center text-white hover:text-red duration-200 cursor-pointer"
                        >
                            <LogoutIcon className="w-7 h-7" />
                        </button>
                        :
                        <Link
                            to={LOGIN_ROUTE}
                            aria-label="авторизация"
                            title="Войти"
                            className="block hover:opacity-80"
                        >
                            <div className="w-10 aspect-square">
                                <ProfileIcon />
                            </div>
                        </Link>
                }
            </li>
        </ul>
    );
};

export default MenuActions;
