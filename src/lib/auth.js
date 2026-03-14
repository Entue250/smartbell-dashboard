'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import API from './api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try { setUser(jwtDecode(token)); }
      catch { Cookies.remove('token'); }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await API.post('/api/auth/login', { username, password });
    Cookies.set('token', data.token, { expires: 7 });
    setUser({ username: data.username, role: data.role });
    return data;
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);