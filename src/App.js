import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { ApiProvider } from './contexts/ApiContext';
import { AppRoutes } from './routes/AppRoutes';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f2b46' },
    secondary: { main: '#2e7d32' },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <ApiProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ApiProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
