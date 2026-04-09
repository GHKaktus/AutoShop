export interface BreadCrumbsConfig {
    path: string;
    title: string; 
    dynamic?: boolean;
}

export interface BreadCrumbsItem {
    id: number;
    title: string;
    path: string;
    isLink: boolean;
}

export type BreadCrumbsList = BreadCrumbsItem[];