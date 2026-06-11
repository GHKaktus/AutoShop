import type { BreadCrumbsConfig, BreadCrumbsList } from "./types";
import { breadCrumbsConfig } from "./config";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { getCategories } from "@/store/categories";

// Запасной вариант названия, если категория не найдена в сторе:
// превращаем slug в читаемый текст ("akkumulyatory" -> "Akkumulyatory")
function humanizeSlug(slug: string): string {
    const text = slug.replace(/-/g, " ").trim();
    return text ? text[0].toUpperCase() + text.slice(1) : slug;
}

// Сопоставляет накопленный путь с конфигом, поддерживая динамические сегменты (":slug")
function matchConfig(accumulatedPath: string): BreadCrumbsConfig | undefined {
    const exact = breadCrumbsConfig.find((config) => config.path === accumulatedPath);
    if (exact) return exact;

    const actualSegments = accumulatedPath.split("/").filter(Boolean);
    return breadCrumbsConfig.find((config) => {
        if (!config.dynamic) return false;
        const configSegments = config.path.split("/").filter(Boolean);
        if (configSegments.length !== actualSegments.length) return false;
        return configSegments.every(
            (segment, index) => segment.startsWith(":") || segment === actualSegments[index]
        );
    });
}

export const breadCrumbs = (): BreadCrumbsList | null => {
    const location = useLocation();
    const categories = useAppSelector(getCategories);
    const path = location.pathname;

    const breadCrumbsList: BreadCrumbsList = [];

    const pathMap = path.split('/').filter(Boolean);
    let accumulatedPath = '';
    for (let i = 0; i < pathMap.length; i++) {
        accumulatedPath += '/' + pathMap[i];

        const currentConfig = matchConfig(accumulatedPath);
        if (!currentConfig) break;

        let title = currentConfig.title;
        // Для динамического сегмента подставляем имя категории по slug из URL
        if (currentConfig.dynamic) {
            const slug = pathMap[i];
            const category = categories.find((item) => item.slug === slug);
            title = category?.name ?? humanizeSlug(slug);
        }

        breadCrumbsList.push({
            id: i,
            path: accumulatedPath,
            title,
            isLink: i !== pathMap.length - 1
        });
    }

    return breadCrumbsList;
}
