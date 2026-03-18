// src/lib/auth.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import API from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const role = Cookies.get('role');
    if (token && username && role) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await API.post('/api/auth/login', { username, password });
    Cookies.set('token', data.token, { expires: 1 / 24 });
    Cookies.set('refresh_token', data.refresh_token, { expires: 30 });
    Cookies.set('username', data.username, { expires: 30 });
    Cookies.set('role', data.role, { expires: 30 });
    setUser({ username: data.username, role: data.role });
    // Hard redirect — triggers middleware which sees the cookie and allows /
    window.location.href = '/';
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('username');
    Cookies.remove('role');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}