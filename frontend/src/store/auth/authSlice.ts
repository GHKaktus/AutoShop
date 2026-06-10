import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import { signIn, signUp, logout } from "@/api/auth";

const TOKEN_KEY = "token";

const initialState: AuthState = {
    token: localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null
};

function toMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

interface Credentials {
    email: string;
    password: string;
}

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }: Credentials, { rejectWithValue }) => {
        try {
            const data = await signIn(email, password);
            return data.token;
        } catch (error) {
            return rejectWithValue(toMessage(error, "Не удалось войти"));
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async ({ email, password }: Credentials, { rejectWithValue }) => {
        try {
            const data = await signUp(email, password);
            return data.token;
        } catch (error) {
            return rejectWithValue(toMessage(error, "Не удалось зарегистрироваться"));
        }
    }
);

export const logoutAccount = createAsyncThunk(
    "auth/logout",
    async () => {
        // Если запрос не прошёл — всё равно завершаем сессию локально
        try {
            await logout();
        } catch {
            // намеренно игнорируем сетевую ошибку при выходе
        }
        return true;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        const onPending = (state: AuthState) => {
            state.loading = true;
            state.error = null;
        };
        const onFulfilled = (state: AuthState, action: { payload: string }) => {
            state.loading = false;
            state.token = action.payload;
            localStorage.setItem(TOKEN_KEY, action.payload);
        };
        const onRejected = (state: AuthState, action: { payload: unknown }) => {
            state.loading = false;
            state.error = (action.payload as string) ?? "Ошибка авторизации";
        };

        builder
            .addCase(login.pending, onPending)
            .addCase(login.fulfilled, onFulfilled)
            .addCase(login.rejected, onRejected)

            .addCase(register.pending, onPending)
            .addCase(register.fulfilled, onFulfilled)
            .addCase(register.rejected, onRejected)

            .addCase(logoutAccount.fulfilled, (state) => {
                state.token = null;
                state.error = null;
                localStorage.removeItem(TOKEN_KEY);
            });
    }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
