import CatalogProducts from "@/components/Catalog/Catalog";
import type { Information } from "@/utils/global-types";

const Catalog = () => {

    const information: Information = {
        title: "Автотовары: аксессуары, расходники и многое другое",
        description: "PROAuto - это специализированный интернет магазин востребованных товаров для автомобилей.",
        maxWidth: "max-w-200"
    }

    return (
        <CatalogProducts information={information}/>
    );
};

export default Catalog;