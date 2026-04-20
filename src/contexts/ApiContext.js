import React, { createContext, useContext, useMemo } from 'react';
import { createApi } from '../api';
import { useAuth } from './AuthContext';

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const { token, logout } = useAuth();

  const api = useMemo(
    () =>
      createApi({
        getAuthToken: () => token,
        onUnauthorized: () => logout(),
      }),
    [token, logout]
  );

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx;
}

