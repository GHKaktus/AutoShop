import Catalog from "@/components/CatalogCategories/CatalogCategories";
import { catalogInformation, welcomeInformation } from "./datasets";
import Welcome from "@/components/Welcome/Welcome";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";

const CatalogCategories = () => {
    return (
        <>
            <Welcome information={welcomeInformation}/>
            <BreadCrumbs />
            <Catalog information={catalogInformation}/>
        </>
    );
};

export default CatalogCategories;