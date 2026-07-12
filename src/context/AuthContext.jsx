import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getProfile } from '../api/index.js';

const AuthContext = createContext(null);

// Helper: persist user to localStorage so page refresh doesn't wipe the session
function saveUser(user) {
  if (user) localStorage.setItem('restora_user', JSON.stringify(user));
  else localStorage.removeItem('restora_user');
}
function loadUser() {
  try { return JSON.parse(localStorage.getItem('restora_user')); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser());
  const [token, setToken] = useState(() => localStorage.getItem('restora_token'));
  const [loading, setLoading] = useState(true);

  // On mount: if we have a stored token, try to refresh the profile from the
  // server (so role/data stays fresh). If the endpoint is unavailable (404/5xx),
  // fall back to the locally-stored user so the session isn't destroyed.
  useEffect(() => {
    const storedToken = localStorage.getItem('restora_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    getProfile()
      .then(data => {
        const u = data.data ?? data;
        setUser(u);
        saveUser(u);
      })
      .catch(() => {
        // Profile endpoint unavailable — keep the stored user if we have one,
        // otherwise clear everything and force re-login.
        const storedUser = loadUser();
        if (!storedUser) {
          localStorage.removeItem('restora_token');
          setToken(null);
        }
        // If storedUser exists, user state is already initialized from useState()
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    const t = data.token ?? data.data?.token;
    const u = data.user ?? data.data?.user;
    localStorage.setItem('restora_token', t);
    setToken(t);
    setUser(u);
    saveUser(u);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await registerUser(formData);
    const t = data.token ?? data.data?.token;
    const u = data.user ?? data.data?.user;
    if (t) {
      localStorage.setItem('restora_token', t);
      setToken(t);
      setUser(u);
      saveUser(u);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch { /* ignore */ }
    localStorage.removeItem('restora_token');
    saveUser(null);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
