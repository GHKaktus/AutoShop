import type { BreadCrumbsConfig, BreadCrumbsList } from "./types";
import { breadCrumbsConfig } from "./config";
import { useLocation } from "react-router-dom";

export const breadCrumbs = (): BreadCrumbsList | null => {
    const location = useLocation();
    const path = location.pathname;

    const breadCrumbsList: BreadCrumbsList = [];

    const pathMap = path.split('/').filter(Boolean);
    let accumulatedPath = '';
    for(let i = 0; i < pathMap.length; i++) {
        accumulatedPath += '/' + pathMap[i];

        const currentConfig: BreadCrumbsConfig | undefined = breadCrumbsConfig.find(obj => obj.path === accumulatedPath);
        if(currentConfig) {
            breadCrumbsList.push({id: i, path: accumulatedPath, title: currentConfig.title, isLink: i === pathMap.length - 1 ? false : true})
        } else {
            break;
        }
    }

    return breadCrumbsList != null ? breadCrumbsList : null;
}