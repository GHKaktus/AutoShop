import CatalogProducts from "@/components/CatalogCategories/CatalogCategories";
import { information } from "./hooks";

const Catalog = () => {

    return (
        <CatalogProducts information={information}/>
    );
};

export default Catalog;