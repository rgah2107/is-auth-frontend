import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showMessage = useCallback((message, severity = 'info') => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') return;
    setState((s) => ({ ...s, open: false }));
  }, []);

  const value = useMemo(() => ({ showMessage }), [showMessage]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={state.severity} variant="filled" sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}

