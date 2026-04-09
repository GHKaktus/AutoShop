import { useAppSelector } from "@/store/hooks";
import type { ListLinks } from "./types";
import { getCategories } from "@/store/categories";

export const useFooterDatasets = () => {
    const categories = useAppSelector(getCategories);

    const listLinks: ListLinks = [
        {
            id: 1,
            title: "Каталог",
            links: categories
        }
    ];

    return {
        listLinks
    }
}