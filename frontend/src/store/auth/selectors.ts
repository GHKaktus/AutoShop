import type { RootState } from "../store";

export const getAuthToken = (state: RootState) => state.auth.token;
export const getIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
export const getAuthLoading = (state: RootState) => state.auth.loading;
export const getAuthError = (state: RootState) => state.auth.error;
