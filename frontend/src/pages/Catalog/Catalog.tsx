import CatalogProducts from "@/components/Catalog/Catalog";
import { catalogInformation, welcomeInformation } from "./datasets";
import Welcome from "@/components/Welcome/Welcome";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";

const Catalog = () => {
    return (
        <>
            <Welcome information={welcomeInformation}/>
            <BreadCrumbs />
            <CatalogProducts information={catalogInformation}/>
        </>
    );
};

export default Catalog;