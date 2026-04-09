import { getCategories } from "@/store/categories";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";

export const useCatalogLogic = () => {
    const categories = useAppSelector(getCategories);

    const [currentCard, setCurrentCard] = useState<number>(1);

    function handleClick(event: React.MouseEvent<HTMLDivElement>, id: number) {
        if (currentCard === id) return;
        setCurrentCard(id);
    }

    return {
        categories,
        currentCard,
        handleClick
    }
}