import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const VALID_EMAIL = 'vanleeuwen.daniel@upnexxt.nl';
  const VALID_PASSWORD = 'Upnexxt098!';

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setLoading(false);
      return {};
    }

    setLoading(false);
    return { error: 'Invalid email or password' };
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};