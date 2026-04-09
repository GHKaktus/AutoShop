import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category, Categories } from "./types";
import { slugify } from "@/utils/slugify";

const initialState: Categories = {
    items: {
        1: { id: 1, name: "Аккумуляторы", slug: slugify("Аккумуляторы"), image: "bg-home-products--akkum" },
        2: { id: 2, name: "Масла", slug: slugify("Автомасла"), image: "bg-home-products--avtomasla" },
        3: { id: 3, name: "Автохимия", slug: slugify("Автохимия"), image: "bg-home-products--avtohimia" },
        4: { id: 4, name: "Аксессуары", slug: slugify("Аксессуары"), image: "bg-home-products--aksess" }
    },
    selectedCategoryId: null,
    loading: false,
    error: null
}

// export const fetchCategories = createAsyncThunk(
//     'categories/fetchCategories',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await fetch('/api/categories');
//             if(!response.ok) throw new Error("Ошибка запроса!")
//             const data: Category[] = await response.json();
//             return data;
//         } catch(error) {
//             return rejectWithValue(error instanceof Error ? error.message : "Ошибка!");
//         }
//     }
// );

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<Category>) => {
            try {
                if (state.items[action.payload.id]) throw new Error("Такой тип уже существует! Выберите другой reducer!")
                state.items[action.payload.id] = action.payload;
            } catch(error) {
                console.log(error instanceof Error ? error.message : "Неизвестная ошибка в categoriesSlice!");
            }
        },
        setSelectedCategory: (state, action: PayloadAction<Category>) => {
            try {
                if (!state.items[action.payload.id]) throw new Error("Категории с таким ID не существует!")
                state.selectedCategoryId = action.payload.id;
            } catch(error) {
                console.log(error instanceof Error ? error.message : "Неизвестная ошибка в categoriesSlice!");
            }
        },
        updateCategory: (state, action: PayloadAction<Category>) => {
            try {
                if (!state.items[action.payload.id]) throw new Error("Категории с таким ID не существует!")
                state.items[action.payload.id] = action.payload;
            } catch(error) {
                console.log(error instanceof Error ? error.message : "Неизвестная ошибка в categoriesSlice!");
            }
        },
        resetCategories: () => {
            return {...initialState};
        }
    }
})

export const { addCategory, setSelectedCategory, updateCategory, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer; 