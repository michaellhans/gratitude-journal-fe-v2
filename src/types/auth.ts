export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}
  
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (credential: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}