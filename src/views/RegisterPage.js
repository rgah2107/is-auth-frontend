import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useSnackbar } from '../contexts/SnackbarContext';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pwd) {
  if (!pwd) return false;
  if (pwd.length < 9 || pwd.length > 20) return false;
  if (!/[0-9]/.test(pwd)) return false;
  if (!/[a-z]/.test(pwd)) return false;
  if (!/[A-Z]/.test(pwd)) return false;
  return true;
}

export function RegisterPage() {
  const api = useApi();
  const { showMessage } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = 'El usuario es requerido.';
    if (!form.email.trim()) next.email = 'El correo es requerido.';
    else if (!isValidEmail(form.email.trim())) next.email = 'Ingrese un correo válido.';
    if (!form.password) next.password = 'La contraseña es requerida.';
    else if (!isValidPassword(form.password)) {
      next.password =
        'Debe tener 9-20 caracteres, números, al menos una mayúscula y una minúscula.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.auth.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      showMessage(data?.message || 'Usuario creado correctamente', 'success');
      navigate('/login', { replace: true });
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
                Registro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cree su usuario para ingresar al sistema.
              </Typography>

              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Usuario *"
                    value={form.username}
                    onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                    error={!!errors.username}
                    helperText={errors.username}
                    fullWidth
                  />
                  <TextField
                    label="Correo *"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                  />
                  <TextField
                    label="Contraseña *"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" disabled={loading}>
                    REGISTRARSE
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2">
                ¿Ya tiene cuenta?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Inicie sesión
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

