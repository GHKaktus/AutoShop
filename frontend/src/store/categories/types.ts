export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

export interface Categories {
    items: Record<number, Category>;
    ids?: number[];
    selectedCategoryId: number | null;
    loading: boolean;
    error: string | null;
}