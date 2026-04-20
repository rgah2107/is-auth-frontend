import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';

export function ClientesListPage() {
  const api = useApi();
  const { userid } = useAuth();
  const { showMessage } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [filters, setFilters] = useState({ identificacion: '', nombre: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.clientes.listar({
        identificacion: filters.identificacion.trim(),
        nombre: filters.nombre.trim(),
        usuarioId: userid,
      });
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      showMessage(api.errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [api, filters.identificacion, filters.nombre, showMessage, userid]);

  useEffect(() => {
    // initial load
    fetchRows();
  }, [fetchRows]);

  const columns = useMemo(
    () => [
      { field: 'identificacion', headerName: 'Identificación', flex: 1, minWidth: isSmall ? 120 : 140 },
      { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: isSmall ? 140 : 160 },
      { field: 'apellidos', headerName: 'Apellidos', flex: 1, minWidth: isSmall ? 160 : 180 },
      {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        filterable: false,
        width: isSmall ? 120 : 140,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => navigate(`/clientes/${params.row.id}`)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [isSmall, navigate]
  );

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.clientes.eliminar(deleteId);
      showMessage('Cliente eliminado correctamente.', 'success');
      setDeleteId(null);
      fetchRows();
    } catch (err) {
      showMessage(api.errorMessage(err), 'error');
    }
  };

  return (
    <AppLayout title="Consulta clientes">
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={900}>
              Consulta clientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use los filtros y presione buscar (lupa).
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Regresar
            </Button>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => navigate('/clientes/nuevo')}>
              Agregar
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end">
              <TextField
                label="Identificación"
                value={filters.identificacion}
                onChange={(e) => setFilters((s) => ({ ...s, identificacion: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Nombre"
                value={filters.nombre}
                onChange={(e) => setFilters((s) => ({ ...s, nombre: e.target.value }))}
                fullWidth
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={fetchRows}
                disabled={loading}
                sx={{ minWidth: 160 }}
              >
                Buscar
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box
              sx={{
                height: { xs: 380, sm: 460 },
                width: '100%',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(r) => r.id}
                loading={loading}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                columnVisibilityModel={{
                  apellidos: !isSmall,
                }}
                density={isSmall ? 'compact' : 'standard'}
                sx={{
                  width: '100%',
                  '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle': {
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    overflowX: 'auto',
                    touchAction: 'pan-x pan-y',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    touchAction: 'pan-x pan-y',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Desea eliminar el cliente seleccionado? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={onConfirmDelete}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </AppLayout>
  );
}

