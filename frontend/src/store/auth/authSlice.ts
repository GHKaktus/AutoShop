import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import { signIn, signUp, logout } from "@/api/auth";

const TOKEN_KEY = "token";
const EMAIL_KEY = "email";

const initialState: AuthState = {
    token: localStorage.getItem(TOKEN_KEY),
    email: localStorage.getItem(EMAIL_KEY),
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

interface AuthSuccess {
    token: string;
    email: string;
}

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }: Credentials, { rejectWithValue }) => {
        try {
            const data = await signIn(email, password);
            return { token: data.token, email };
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
            return { token: data.token, email };
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
        },
        // Установить сессию вручную (например, после восстановления пароля)
        setCredentials: (state, action: { payload: AuthSuccess }) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.error = null;
            localStorage.setItem(TOKEN_KEY, action.payload.token);
            localStorage.setItem(EMAIL_KEY, action.payload.email);
        }
    },
    extraReducers: (builder) => {
        const onPending = (state: AuthState) => {
            state.loading = true;
            state.error = null;
        };
        const onFulfilled = (state: AuthState, action: { payload: AuthSuccess }) => {
            state.loading = false;
            state.token = action.payload.token;
            state.email = action.payload.email;
            localStorage.setItem(TOKEN_KEY, action.payload.token);
            localStorage.setItem(EMAIL_KEY, action.payload.email);
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
                state.email = null;
                state.error = null;
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(EMAIL_KEY);
            });
    }
});

export const { clearAuthError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
