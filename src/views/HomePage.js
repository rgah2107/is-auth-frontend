import React from 'react';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Inicio">
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={900}>
          Bienvenido
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Desde aquí puedes administrar los clientes.
        </Typography>

        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={800}>
                  Cuentas clientes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consultar, crear, editar y eliminar clientes.
                </Typography>
              </Stack>
              <Button variant="contained" onClick={() => navigate('/clientes')}>
                Ir a clientes
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppLayout>
  );
}

