import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Category } from "./types";

export const getAllCategories = (state: RootState) => state.categories.items;
export const getCategories = createSelector(
    [getAllCategories],
    (items) => Object.values(items)
);
export const getCategoryById = (id: number) => (state: RootState): Category => state.categories.items[id];
export const getSelectedCategory =  (state: RootState): Category | null => {
    if (!state.categories.selectedCategoryId) return null;
    return state.categories.items[state.categories.selectedCategoryId];
}