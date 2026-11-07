import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '@/services/authService';
import { tokenStorage, userStorage } from '@/services/storage';
import type { User } from '@/types/models';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [token, rawUser] = await Promise.all([tokenStorage.get(), userStorage.get()]);
        if (token && rawUser) {
          setUser(JSON.parse(rawUser) as User);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        const result = await authService.login(email, password);
        await tokenStorage.set(result.token);
        await userStorage.set(JSON.stringify(result.user));
        setUser(result.user);
      },
      async signUp(name, email, password) {
        const result = await authService.register({ name, email, password });
        await tokenStorage.set(result.token);
        await userStorage.set(JSON.stringify(result.user));
        setUser(result.user);
      },
      async signOut() {
        await Promise.all([tokenStorage.clear(), userStorage.clear()]);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
