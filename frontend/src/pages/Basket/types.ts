export interface Product {
    id: number;
    name: string;
    cost: number;
    sale_cost: number;
    picture: string;
    description: string;
    stock: number;
}

export interface BasketItem {
    product: Product;
    quantity: number;
}

export type BasketListItems = BasketItem[];