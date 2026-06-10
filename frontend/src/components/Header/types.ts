export interface Subtitle {
    id: number;
    name: string;
    slug: string;
}

export interface NavigateOption {
    id: number;
    path: string;
    title: string;
    slug?: string;
    subtitles: Subtitle[] | null;
}

export type MenuNavigation = NavigateOption[];