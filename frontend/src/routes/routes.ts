import type { AuthRoutes, PublicRoutes } from "./types";
import { ABOUT_ROUTE, BASE_ROUTE, BASKET_OFFER_ROUTE, BASKET_ROUTE, CATALOG_SLUG_ROUTE, CATALOG_ROUTE, CONTACTS_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "@/utils/consts";
import Home from '@/pages/Home/index';
import CatalogCategories from "@/pages/Catalog/CatalogCategories/CatalogCategories";
import CatalogProducts from "@/pages/Catalog/CatalogProducts/CatalogProducts";
import Basket from "@/pages/Basket/Basket";
import Offer from "@/pages/Offer/Offer";
import Contacts from "@/pages/Contacts/Contacts";
import About from "@/pages/About/About";
import Auth from "@/pages/Auth/Auth";

export const authRoutes: AuthRoutes = [
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: BASKET_OFFER_ROUTE,
        Component: Offer
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
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    }
]