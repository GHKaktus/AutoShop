import { ABOUT_NEWS_ROUTE, ABOUT_REVIEWS_ROUTE, ABOUT_ROUTE, BASKET_OFFER_ROUTE, BASKET_ROUTE, CATALOG_ID_ROUTE, CATALOG_ROUTE, CONTACTS_ROUTE } from "@/utils/consts";
import type { BreadCrumbsConfig } from "./types";

export const breadCrumbsConfig: BreadCrumbsConfig[] = [
    { path: CATALOG_ROUTE, title: "Каталог" },
    { path: CATALOG_ID_ROUTE, title: "Каталог", dynamic: true },
    { path: ABOUT_ROUTE, title: "О компании" },
    { path: ABOUT_NEWS_ROUTE, title: "Новости" },
    { path: ABOUT_REVIEWS_ROUTE, title: "Отзывы" },
    { path: BASKET_ROUTE, title: "Корзина" },
    { path: BASKET_OFFER_ROUTE, title: "Оформление заказа" },
    { path: CONTACTS_ROUTE, title: "Контакты" }
];