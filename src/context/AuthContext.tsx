import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isApproved: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isApproved: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkApprovalStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkApprovalStatus(session.user.id);
      } else {
        setIsApproved(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkApprovalStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('approved')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking approval status:', error);
        setIsApproved(false);
        return;
      }

      setIsApproved(data?.approved ?? false);
    } catch (error) {
      console.error('Error:', error);
      setIsApproved(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsApproved(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isApproved, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;