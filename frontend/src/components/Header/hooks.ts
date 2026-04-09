import { getCategories, type Category } from "@/store/categories";
import { useAppSelector } from "@/store/hooks";
import type { MenuNavigation, Subtitle } from "./types";
import { ABOUT_ROUTE, BASE_ROUTE, CATALOG_ROUTE, CONTACTS_ROUTE } from "@/utils/consts";
import { useState } from "react";

export const useHeaderDatasets = () => {
    const categoriesObjects: Category[] = useAppSelector(getCategories);
    const categoriesNames: Subtitle[] = categoriesObjects.map(element => ({ id: element.id, name: element.name }));
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

    const [currentOption, setCurrentOption] = useState<number>(0);
    const [hoverOption, setHoverOption] = useState<number>(0);

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
        handleClick,
        handleMouseEnter,
        handleMouseLeave
    }
}