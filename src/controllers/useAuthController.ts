import { useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginFormValues, RegisterFormValues } from '@/models/auth.model';
import { authService } from '@/services/auth.service';
import { useAppStore } from '@/core/store/app.store';

export function useAuthController() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        useAppStore.getState().setUser(currentUser);
      }
    } catch (e: any) {
      setError(e.message || 'Kullanıcı oturumu yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = async (values: LoginFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      const authUser = await authService.login(values);
      setUser(authUser);
      useAppStore.getState().setUser(authUser);
      return authUser;
    } catch (e: any) {
      setError(e.message || 'Giriş yapılırken hata oluştu');
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (values: RegisterFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      const authUser = await authService.register(values);
      setUser(authUser);
      useAppStore.getState().setUser(authUser);
      return authUser;
    } catch (e: any) {
      setError(e.message || 'Kayıt oluşturulurken hata oluştu');
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    useAppStore.getState().logout();
  };

  return {
    user,
    loading,
    submitting,
    error,
    isAuthenticated: !!user,
    isCorporate: user?.userType === 'corporate',
    login,
    register,
    logout,
    refreshUser: loadCurrentUser,
  };
}
