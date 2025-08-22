'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useHydrated } from '@/hooks/useHydrated';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hydrated = useHydrated();

  const user = session?.user as User | null;
  const isAuthenticated = !!session && !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (hydrated) {
      setIsLoading(status === 'loading');
    }
  }, [status, hydrated]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { 
          success: false, 
          error: 'Email ou mot de passe incorrect' 
        };
      }

      if (result?.ok || result === undefined) {
        // Dans NextAuth v5, un résultat undefined peut signifier succès
        // Forcer une mise à jour de la session
        await update();
        return { success: true };
      }

      return { 
        success: false, 
        error: 'Une erreur est survenue lors de la connexion' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Une erreur est survenue' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async (): Promise<void> => {
    try {
      await update();
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  // Pendant l'hydratation, retourner des valeurs par défaut pour éviter les différences SSR/Client
  const contextValue = {
    user: hydrated ? user : null,
    isLoading: hydrated ? isLoading : true,
    isAuthenticated: hydrated ? isAuthenticated : false,
    isAdmin: hydrated ? isAdmin : false,
    login,
    logout,
    checkSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook pour protéger les routes admin
export function useRequireAuth() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  return { isAuthenticated, isAdmin, isLoading };
}