import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth, getRememberedUsername } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';

export function LoginPage() {
  const api = useApi();
  const auth = useAuth();
  const { showMessage } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const remembered = useMemo(() => getRememberedUsername(), []);
  const [form, setForm] = useState({
    username: remembered,
    password: '',
    remember: !!remembered,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.username?.trim()) next.username = 'El usuario es requerido.';
    if (!form.password) next.password = 'La contraseña es requerida.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.auth.login({
        username: form.username.trim(),
        password: form.password,
      });
      auth.login(data);
      auth.setRememberedUsername(form.remember ? form.username.trim() : '');
      showMessage('Inicio de sesión exitoso.', 'success');

      const from = location.state?.from;
      navigate(from || '/', { replace: true });
    } catch (err) {
      showMessage(api.errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Card elevation={6}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Iniciar sesión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accede para gestionar clientes.
              </Typography>

              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Usuario *"
                    value={form.username}
                    onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                    error={!!errors.username}
                    helperText={errors.username}
                    autoComplete="username"
                    fullWidth
                  />
                  <TextField
                    label="Contraseña *"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                    error={!!errors.password}
                    helperText={errors.password}
                    autoComplete="current-password"
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.remember}
                        onChange={(e) => setForm((s) => ({ ...s, remember: e.target.checked }))}
                      />
                    }
                    label="Recuérdame"
                  />
                  <Button type="submit" variant="contained" disabled={loading}>
                    INICIAR SESIÓN
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2">
                ¿No tiene una cuenta?{' '}
                <Link component={RouterLink} to="/register" underline="hover">
                  Regístrese
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

