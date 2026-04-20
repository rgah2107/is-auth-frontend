import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const LS_AUTH_KEY = 'isAuth.auth';
const LS_REMEMBER_USERNAME_KEY = 'isAuth.rememberedUsername';

function loadAuthFromStorage() {
  try {
    const raw = localStorage.getItem(LS_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.userid || !parsed?.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getRememberedUsername() {
  try {
    return localStorage.getItem(LS_REMEMBER_USERNAME_KEY) || '';
  } catch {
    return '';
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuthFromStorage());

  const isAuthenticated = !!auth?.token;

  const login = useCallback(({ token, userid, username }) => {
    const next = { token, userid, username };
    setAuth(next);
    localStorage.setItem(LS_AUTH_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem(LS_AUTH_KEY);
  }, []);

  const setRememberedUsername = useCallback((username) => {
    try {
      if (username) localStorage.setItem(LS_REMEMBER_USERNAME_KEY, username);
      else localStorage.removeItem(LS_REMEMBER_USERNAME_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      token: auth?.token || null,
      userid: auth?.userid || null,
      username: auth?.username || null,
      isAuthenticated,
      login,
      logout,
      setRememberedUsername,
    }),
    [auth, isAuthenticated, login, logout, setRememberedUsername]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

