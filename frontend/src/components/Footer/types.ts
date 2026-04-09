import type { Category } from "@/store/categories";

export interface ElementLinks {
    id: number;
    title: string;
    links: Category[];
}

export type ListLinks = ElementLinks[];