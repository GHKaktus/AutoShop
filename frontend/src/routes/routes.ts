import type { AuthRoutes, PublicRoutes } from "./types";
import { ABOUT_ROUTE, BASE_ROUTE, BASKET_OFFER_ROUTE, BASKET_ROUTE, CATALOG_SLUG_ROUTE, CATALOG_ROUTE, CONTACTS_ROUTE } from "@/utils/consts";
import Home from '@/pages/Home/index';
import CatalogCategories from "@/pages/Catalog/CatalogCategories/CatalogCategories";
import CatalogProducts from "@/pages/Catalog/CatalogProducts/CatalogProducts";
import Basket from "@/pages/Basket/Basket";
import Contacts from "@/pages/Contacts/Contacts";
import About from "@/pages/About/About";

export const authRoutes: AuthRoutes = [
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: BASKET_OFFER_ROUTE,
        Component: Basket
    }
]

export const publicRoutes: PublicRoutes = [
    {
        path: BASE_ROUTE,
        Component: Home
    },
    {
        path: ABOUT_ROUTE,
        Component: About
    },
    {
        path: CATALOG_ROUTE,
        Component: CatalogCategories
    },
    {
        path: CATALOG_SLUG_ROUTE,
        Component: CatalogProducts
    },
    {
        path: CONTACTS_ROUTE,
        Component: Contacts
    }
]