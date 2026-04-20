import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={900}>
            404
          </Typography>
          <Typography variant="body1" color="text.secondary">
            La página que buscas no existe.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => navigate(isAuthenticated ? '/' : '/login')}>
              Volver
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

