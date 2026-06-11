import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./categories/categoriesSlice";
import basketReducer from "./basket/basketSlice";
import authReducer from "./auth/authSlice";

const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        basket: basketReducer,
        auth: authReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;