import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BasketItem, BasketState } from "./types";
import {
    getBasket,
    updateBasketItem,
    removeBasketItem
} from "@/api/basket";
import type { RootState } from "../store";

const initialState: BasketState = {
    items: [],
    loading: false,
    error: null,
    updatingIds: []
};

function toMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

// GET /basket — загрузка содержимого корзины с сервера
export const fetchBasket = createAsyncThunk(
    "basket/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getBasket();
            return data.items as BasketItem[];
        } catch (error) {
            return rejectWithValue(toMessage(error, "Не удалось загрузить корзину"));
        }
    }
);

// PATCH /basket/:id — новое количество товара (0 удаляет товар из корзины)
export const changeQuantity = createAsyncThunk(
    "basket/changeQuantity",
    async (
        { productId, quantity }: { productId: number; quantity: number },
        { rejectWithValue }
    ) => {
        const safeQuantity = Math.max(0, Math.floor(quantity));
        try {
            await updateBasketItem(productId, safeQuantity);
            return { productId, quantity: safeQuantity };
        } catch (error) {
            return rejectWithValue(toMessage(error, "Не удалось обновить количество"));
        }
    }
);

// DELETE /basket/:id — удаление одного товара
export const removeItem = createAsyncThunk(
    "basket/removeItem",
    async (productId: number, { rejectWithValue }) => {
        try {
            await removeBasketItem(productId);
            return productId;
        } catch (error) {
            return rejectWithValue(toMessage(error, "Не удалось удалить товар"));
        }
    }
);

// Отдельного эндпоинта очистки нет — удаляем все товары по одному
export const clearBasket = createAsyncThunk(
    "basket/clear",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        try {
            await Promise.all(
                state.basket.items.map((item) => removeBasketItem(item.product.id))
            );
            return true;
        } catch (error) {
            return rejectWithValue(toMessage(error, "Не удалось очистить корзину"));
        }
    }
);

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        // Локальная очистка состояния без запросов к серверу
        // (например, корзина опустошается на бэкенде после оформления заказа)
        resetBasket: (state) => {
            state.items = [];
            state.updatingIds = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBasket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBasket.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBasket.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? "Не удалось загрузить корзину";
            })

            .addCase(changeQuantity.pending, (state, action) => {
                state.error = null;
                state.updatingIds.push(action.meta.arg.productId);
            })
            .addCase(changeQuantity.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                state.updatingIds = state.updatingIds.filter((id) => id !== productId);
                if (quantity === 0) {
                    state.items = state.items.filter((item) => item.product.id !== productId);
                    return;
                }
                const item = state.items.find((entry) => entry.product.id === productId);
                if (item) item.quantity = quantity;
            })
            .addCase(changeQuantity.rejected, (state, action) => {
                state.updatingIds = state.updatingIds.filter(
                    (id) => id !== action.meta.arg.productId
                );
                state.error = (action.payload as string) ?? "Не удалось обновить количество";
            })

            .addCase(removeItem.pending, (state, action) => {
                state.error = null;
                state.updatingIds.push(action.meta.arg);
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                state.updatingIds = state.updatingIds.filter((id) => id !== action.payload);
                state.items = state.items.filter((item) => item.product.id !== action.payload);
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.updatingIds = state.updatingIds.filter((id) => id !== action.meta.arg);
                state.error = (action.payload as string) ?? "Не удалось удалить товар";
            })

            .addCase(clearBasket.fulfilled, (state) => {
                state.items = [];
            })
            .addCase(clearBasket.rejected, (state, action) => {
                state.error = (action.payload as string) ?? "Не удалось очистить корзину";
            });
    }
});

export const { resetBasket } = basketSlice.actions;
export default basketSlice.reducer;
