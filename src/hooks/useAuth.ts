import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const setTokens = useAuthStore(s => s.setTokens);
  const setUser = useAuthStore(s => s.setUser);
  const logout = useAuthStore(s => s.logout);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login/', { email, password, username: email });
      const data = res.data;

      setTokens(data.access, data.refresh);
      setUser({ email, name: email.split('@')[0] }); // Temporary name resolution fallback
      
      // Parallel legacy support for raw token reads
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Synced legacy keys per request
      localStorage.setItem('token', data.access);
      localStorage.setItem('user_data', JSON.stringify({ email, name: email.split('@')[0] }));
      
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
      const res = await api.post('/auth/register/', { email, password, first_name: name, username: email });
      const data = res.data;

      // Explicitly decoupled auto-login chain to enforce post-registration UI feedback
      return true;
      
    } catch (err: any) {
      const data = err.response?.data || {};
      const rawErr = Object.values(data).flat().join(' ').toLowerCase();
      if (rawErr.includes('already exists')) {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError(Object.values(data).flat().join(', ') || err.message || 'Network error');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generalized fetch wrapper auto-injecting the Bearer Token.
   * Drop this in over standard `fetch` for secure endpoints like Orders.
   */
  const apiFetch = async (endpoint: string, options: any = {}) => {
    // Legacy bridge: using axios under the hood
    const method = options.method?.toLowerCase() || 'get';
    return api({
      url: endpoint,
      method: method,
      data: options.body ? JSON.parse(options.body) : undefined,
    });
  };

  const handleLogout = () => {
    logout(); // Resets Zustand internally (token: null, user: null, isAuthenticated: false)
    
    // Explicit manual teardown matching exact key requirements
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    
    // Clean persist store safely, intentionally preserving 'obsidian-cart'
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('obsidian-auth-core'); 
    
    console.log("Logout successful, storage cleared");
    navigate('/auth');
  };

  return { login, register, logout: handleLogout, apiFetch, loading, error };
}
