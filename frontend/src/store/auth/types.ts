export interface AuthState {
    token: string | null;
    email: string | null;
    loading: boolean;
    error: string | null;
}
