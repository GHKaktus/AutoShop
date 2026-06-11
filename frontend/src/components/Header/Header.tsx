import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ADMIN_ROUTE, BASE_ROUTE, CONTACTS_ROUTE } from "@/utils/consts";
import MenuNavigation from "./HeaderComponents/MenuNavigation";
import MenuActions from "./HeaderComponents/MenuActions";
import BurgerButton from "./HeaderComponents/BurgerButton";
import BurgerMenu from "./HeaderComponents/BurgerMenu";
import Button from "../ui/Button";
import { useIsAdmin } from "@/pages/Admin/hooks";
import './styles.css';

const Header = () => {

    const isAdmin = useIsAdmin();

    const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState<boolean>(false);
    const [isHiddenButton, setIsHiddenButton] = useState<boolean>(false);
    const [isHiddenBurgerButton, setIsHiddenBurgerButton] = useState<boolean>(false);
    const [isHiddenMenuNavigation, setIsHiddenMenuNavigation] = useState<boolean>(false);

    function handleClickBurgerButton() {
        setIsOpenBurgerMenu(prev => !prev);
    }

    function handleClickToCloseBurgerMenu(e: MouseEvent) {
        if(!isOpenBurgerMenu) return;
        const isHtml = e.target;
        if(!(isHtml instanceof HTMLElement)) return;
        const menu = isHtml.closest('#burger-menu');
        const button = isHtml.closest('#burger-button');
        if(menu || button) return;
        setIsOpenBurgerMenu(false);
    }

    // Следит за изменением экрана для появления BurgerButton
    useEffect(() => {
        const matchesQuery = window.matchMedia('(max-width: 1200px)');
        const handler = (e: MediaQueryListEvent) => setIsHiddenBurgerButton(!e.matches);
        setIsHiddenBurgerButton(!matchesQuery.matches);
        matchesQuery.addEventListener('change', handler);
        return () => matchesQuery.removeEventListener('change', handler);
    }, []);

    // Следит за изменением экрана для скрытия Button
    useEffect(() => {
        const matchesQuery = window.matchMedia('(max-width: 1024px)');
        const handler = (e: MediaQueryListEvent) => setIsHiddenButton(e.matches);
        setIsHiddenButton(matchesQuery.matches);
        matchesQuery.addEventListener('change', handler);
        return () => matchesQuery.removeEventListener('change', handler);
    }, []);

    // Следит за изменением экрана для скрытия MenuNavigation
    useEffect(() => {
        const matchesQuery = window.matchMedia('(max-width: 767px)');
        const handler = (e: MediaQueryListEvent) => setIsHiddenMenuNavigation(e.matches);
        setIsHiddenMenuNavigation(matchesQuery.matches);
        matchesQuery.addEventListener('change', handler);
        return () => matchesQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if(isHiddenBurgerButton) return;
        document.addEventListener('click', handleClickToCloseBurgerMenu);
        return () => document.removeEventListener('click', handleClickToCloseBurgerMenu);
    }, [isHiddenBurgerButton, isOpenBurgerMenu]);

    return (
        <header className="fixed top-0 left-0 z-100 w-full bg-transparent text-white py-[16px] md:pt-6 md:pb-4.5">
            <div 
                className="
                    container relative z-2 
                    grid gap-x-6 items-center
                    grid-cols-[132px_auto_56px]
                    lg:grid-cols-[132px_auto_200px_56px]
                    xl:grid-cols-[132px_auto_200px_156px]
                "
            >
                <Link to={BASE_ROUTE}>
                    <img src="/src/assets/icons/logo.svg" alt="Логотип компании" className="h-[46px] md:h-[56px] duration-200 hover:opacity-80" />
                </Link>
                <MenuNavigation display="header" isHidden={isHiddenMenuNavigation}/>
                <Button type="link" linkTo={isAdmin ? ADMIN_ROUTE : CONTACTS_ROUTE} paddingInline="px-3 md:px-5" paddingBlock="py-3" addClasses={`${isHiddenButton && 'hidden'} whitespace-nowrap text-center`}>
                    {isAdmin ? "Админ панель" : "Заказать звонок"}
                </Button>
                <MenuActions display='header' isHidden={!isHiddenBurgerButton} />
                <BurgerButton isHidden={isHiddenBurgerButton} isOpen={isOpenBurgerMenu} onClick={handleClickBurgerButton}/>
                <BurgerMenu isHidden={isHiddenBurgerButton} isOpen={isOpenBurgerMenu} isHiddenMenuNavigation={isHiddenMenuNavigation} isHiddenMenuActions={isHiddenBurgerButton} isHiddenButton={isHiddenButton}/>
            </div>
            <div className="absolute z-1 top-0 left-0 w-full h-full bg-black opacity-95">

            </div>
        </header>
    );
};

export default Header;