import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE = 'http://127.0.0.1:8000/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setTokens = useAuthStore(s => s.setTokens);
  const setUser = useAuthStore(s => s.setUser);
  const logout = useAuthStore(s => s.logout);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      setTokens(data.access, data.refresh);
      setUser({ email, name: email.split('@')[0] }); // Temporary name resolution fallback
      return true;
    } catch (err: any) {
      setError(err.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, first_name: name })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(Object.values(data).flat().join(', ') || 'Registration failed');
      }

      // Chain logic: immediately login after registering to yield active tokens
      return await login(email, password);
      
    } catch (err: any) {
      setError(err.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generalized fetch wrapper auto-injecting the Bearer Token.
   * Drop this in over standard `fetch` for secure endpoints like Orders.
   */
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = useAuthStore.getState().token;
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return fetch(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return { login, register, logout: handleLogout, apiFetch, loading, error };
}
