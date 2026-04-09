export interface Subtitle {
    id: number;
    name: string;
}

export interface NavigateOption {
    id: number;
    path: string;
    title: string;
    subtitles: Subtitle[] | null;
}

export type MenuNavigation = NavigateOption[];