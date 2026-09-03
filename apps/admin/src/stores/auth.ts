import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

import { API_BASE_URL } from '../config';

const isTokenExpired = (rawToken: string): boolean => {
  if (!rawToken) return true;
  try {
    const parts = rawToken.split('.');
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const getInitialToken = (): string => {
    const savedToken = localStorage.getItem('admin_token') || '';
    if (savedToken && isTokenExpired(savedToken)) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return '';
    }
    return savedToken;
  };

  const getInitialUser = (): AdminUser | null => {
    const savedToken = localStorage.getItem('admin_token') || '';
    if (!savedToken || isTokenExpired(savedToken)) {
      return null;
    }
    try {
      return JSON.parse(localStorage.getItem('admin_user') || 'null');
    } catch {
      return null;
    }
  };

  const token = ref<string>(getInitialToken());
  const user = ref<AdminUser | null>(getInitialUser());
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    if (!token.value) return false;
    return !isTokenExpired(token.value);
  });
  const userPermissions = computed(() => user.value?.permissions || []);

  const hasPermission = (perm: string) => {
    if (!user.value) return false;
    const roleName = typeof user.value.role === 'object' ? (user.value.role as any)?.name : user.value.role;
    if (roleName?.toLowerCase() === 'owner' || roleName?.toLowerCase() === 'superadmin') return true;
    return userPermissions.value.includes(perm) || userPermissions.value.includes('*');
  };

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Invalid credentials');
      }

      const data = await res.json();
      token.value = data.accessToken;
      user.value = data.user;

      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      return data;
    } catch (e: any) {
      error.value = e.message || 'Login failed';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    userPermissions,
    hasPermission,
    login,
    logout,
  };
});
