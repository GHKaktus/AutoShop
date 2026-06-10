export interface Product {
    id: number;
    name: string;
    cost: number;
    sale_cost: number;
    picture?: string | null;
    description?: string | null;
    stock: number;
}
