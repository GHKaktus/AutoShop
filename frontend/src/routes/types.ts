import { type ComponentType } from "react";

export interface Route {
    path: string;
    Component: ComponentType
}

export type AuthRoutes = Route[] 
export type PublicRoutes = Route[]