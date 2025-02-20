export interface PendingUser {
  id: string;
  email: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  approved: boolean;
  created_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user?: User;
  error?: AuthError;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}