import { getCategories, type Category } from "@/store/categories";
import { useAppSelector } from "@/store/hooks";
import type { MenuNavigation, Subtitle } from "./types";
import { ABOUT_ROUTE, CATALOG_ROUTE, CONTACTS_ROUTE, PRODUCTS_ROUTE } from "@/utils/consts";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function resolveActiveOption(path: string): number {
    if (path === CONTACTS_ROUTE || path.startsWith(`${CONTACTS_ROUTE}/`)) return 5;
    if (path === ABOUT_ROUTE || path.startsWith(`${ABOUT_ROUTE}/`)) return 1;
    if (
        path === CATALOG_ROUTE || path.startsWith(`${CATALOG_ROUTE}/`) ||
        path === PRODUCTS_ROUTE || path.startsWith(`${PRODUCTS_ROUTE}/`)
    ) return 2;
    return 0;
}

export const useHeaderDatasets = () => {
    const categoriesObjects: Category[] = useAppSelector(getCategories);
    const categoriesNames: Subtitle[] = categoriesObjects.map(element => ({ id: element.id, name: element.name, slug: element.slug }));
    const menuNavigation: MenuNavigation = [
        {
            id: 1,
            path: ABOUT_ROUTE,
            title: "Компания",
            subtitles: null
        },
        {
            id: 2,
            path: CATALOG_ROUTE,
            title: "Каталог",
            subtitles: categoriesNames
        },
        {
            id: 5,
            path: CONTACTS_ROUTE,
            title: "Контакты",
            subtitles: null
        }
    ];

    const location = useLocation();
    const [currentOption, setCurrentOption] = useState<number>(() => resolveActiveOption(location.pathname));
    const [hoverOption, setHoverOption] = useState<number>(0);
    const [isDesktop, setIsDesktop] = useState<boolean>(true);

    // Подсветка пункта меню следует за текущим маршрутом (в т.ч. при переходе через «Заказать звонок»)
    useEffect(() => {
        setCurrentOption(resolveActiveOption(location.pathname));
    }, [location.pathname]);

    function handleClick(event: React.MouseEvent<HTMLElement>, id: number) {
        if (currentOption === id) return;
        setCurrentOption(id);
    }

    function handleMouseEnter(event: React.MouseEvent<HTMLElement>, id: number) {
        setHoverOption(id);
    }

    function handleMouseLeave() {
        setHoverOption(0);
    }

    return {
        categoriesObjects,
        categoriesNames,
        menuNavigation,
        currentOption,
        hoverOption,
        isDesktop,
        setIsDesktop,
        handleClick,
        handleMouseEnter,
        handleMouseLeave
    }
}