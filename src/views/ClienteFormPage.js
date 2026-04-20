import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { toDateInputValue, fromDateInputValue } from '../utils/dates';
import { base64ToDataUrl, fileToBase64 } from '../utils/imageBase64';

function validateRequired(label, value) {
  if (value === null || value === undefined) return `${label} es requerido.`;
  if (typeof value === 'string' && !value.trim()) return `${label} es requerido.`;
  return null;
}

export function ClienteFormPage({ mode }) {
  const api = useApi();
  const { userid } = useAuth();
  const { showMessage } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const isEdit = mode === 'edit';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [intereses, setIntereses] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    identificacion: '',
    celular: '',
    otroTelefono: '',
    direccion: '',
    fNacimiento: '',
    fAfiliacion: '',
    sexo: '',
    resennaPersonal: '',
    imagen: '',
    interesFK: '',
  });

  const imagePreview = useMemo(() => base64ToDataUrl(form.imagen), [form.imagen]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const ints = await api.intereses.listado();
        setIntereses(Array.isArray(ints) ? ints : []);

        if (isEdit) {
          const data = await api.clientes.obtener(id);
          setForm((s) => ({
            ...s,
            nombre: data?.nombre || '',
            apellidos: data?.apellidos || '',
            identificacion: data?.identificacion || '',
            celular: data?.telefonoCelular || '',
            otroTelefono: data?.otroTelefono || '',
            direccion: data?.direccion || '',
            fNacimiento: toDateInputValue(data?.fNacimiento),
            fAfiliacion: toDateInputValue(data?.fAfiliacion),
            sexo: data?.sexo || '',
            resennaPersonal: data?.resenaPersonal || '',
            imagen: data?.imagen || '',
            interesFK: data?.interesesId || '',
          }));
        }
      } catch (err) {
        showMessage(api.errorMessage(err), 'error');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [api, id, isEdit, showMessage]);

  const validate = () => {
    const next = {};
    next.nombre = validateRequired('Nombre', form.nombre);
    next.apellidos = validateRequired('Apellidos', form.apellidos);
    next.identificacion = validateRequired('Identificación', form.identificacion);
    next.celular = validateRequired('Teléfono celular', form.celular);
    next.otroTelefono = validateRequired('Otro teléfono', form.otroTelefono);
    next.direccion = validateRequired('Dirección', form.direccion);
    next.fNacimiento = validateRequired('Fecha de nacimiento', form.fNacimiento);
    next.fAfiliacion = validateRequired('Fecha de afiliación', form.fAfiliacion);
    next.sexo = validateRequired('Sexo', form.sexo);
    next.resennaPersonal = validateRequired('Reseña personal', form.resennaPersonal);
    next.interesFK = validateRequired('Intereses', form.interesFK);

    Object.keys(next).forEach((k) => {
      if (!next[k]) delete next[k];
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onPickImage = async (file) => {
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setForm((s) => ({ ...s, imagen: b64 }));
    } catch (err) {
      showMessage(err?.message || 'No fue posible cargar la imagen.', 'error');
    }
  };

  const onSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payloadBase = {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        identificacion: form.identificacion.trim(),
        celular: form.celular.trim(),
        otroTelefono: form.otroTelefono.trim(),
        direccion: form.direccion.trim(),
        fNacimiento: fromDateInputValue(form.fNacimiento),
        fAfiliacion: fromDateInputValue(form.fAfiliacion),
        sexo: form.sexo,
        resennaPersonal: form.resennaPersonal.trim(),
        imagen: form.imagen || null,
        interesFK: form.interesFK,
        usuarioId: userid,
      };

      if (isEdit) {
        await api.clientes.actualizar({ id, ...payloadBase });
        showMessage('Cliente actualizado correctamente.', 'success');
      } else {
        await api.clientes.crear(payloadBase);
        showMessage('Cliente creado correctamente.', 'success');
      }
      navigate('/clientes', { replace: true });
    } catch (err) {
      showMessage(api.errorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Mantenimiento de clientes">
        <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
          <CircularProgress />
        </Stack>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Mantenimiento de clientes">
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={900}>
              Mantenimiento de clientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los campos marcados con * son obligatorios (la imagen es opcional).
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={() => navigate('/clientes')}
            >
              Regresar
            </Button>
            <Button startIcon={<SaveIcon />} variant="contained" onClick={onSave} disabled={saving}>
              Guardar
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack spacing={1} sx={{ width: { xs: '100%', md: 280 } }} alignItems="center">
                <Avatar
                  variant="rounded"
                  src={imagePreview}
                  sx={{ width: 220, height: 220, bgcolor: 'grey.200' }}
                />
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                  Cargar imagen
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickImage(e.target.files?.[0])}
                  />
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setForm((s) => ({ ...s, imagen: '' }))}
                  disabled={!form.imagen}
                >
                  Quitar imagen
                </Button>
              </Stack>

              <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />

              <Stack spacing={2} sx={{ flex: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Nombre *"
                    value={form.nombre}
                    onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    fullWidth
                    inputProps={{ maxLength: 50 }}
                  />
                  <TextField
                    label="Apellidos *"
                    value={form.apellidos}
                    onChange={(e) => setForm((s) => ({ ...s, apellidos: e.target.value }))}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos}
                    fullWidth
                    inputProps={{ maxLength: 100 }}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Identificación *"
                    value={form.identificacion}
                    onChange={(e) => setForm((s) => ({ ...s, identificacion: e.target.value }))}
                    error={!!errors.identificacion}
                    helperText={errors.identificacion}
                    fullWidth
                    inputProps={{ maxLength: 20 }}
                  />
                  <FormControl fullWidth error={!!errors.interesFK}>
                    <InputLabel id="interes-label">Intereses *</InputLabel>
                    <Select
                      labelId="interes-label"
                      label="Intereses *"
                      value={form.interesFK}
                      onChange={(e) => setForm((s) => ({ ...s, interesFK: e.target.value }))}
                    >
                      {intereses.map((it) => (
                        <MenuItem key={it.id} value={it.id}>
                          {it.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.interesFK}</FormHelperText>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Teléfono celular *"
                    value={form.celular}
                    onChange={(e) => setForm((s) => ({ ...s, celular: e.target.value }))}
                    error={!!errors.celular}
                    helperText={errors.celular}
                    fullWidth
                    inputProps={{ maxLength: 20 }}
                  />
                  <TextField
                    label="Otro teléfono *"
                    value={form.otroTelefono}
                    onChange={(e) => setForm((s) => ({ ...s, otroTelefono: e.target.value }))}
                    error={!!errors.otroTelefono}
                    helperText={errors.otroTelefono}
                    fullWidth
                    inputProps={{ maxLength: 20 }}
                  />
                </Stack>

                <TextField
                  label="Dirección *"
                  value={form.direccion}
                  onChange={(e) => setForm((s) => ({ ...s, direccion: e.target.value }))}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                  fullWidth
                  inputProps={{ maxLength: 200 }}
                />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Fecha de nacimiento *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.fNacimiento}
                    onChange={(e) => setForm((s) => ({ ...s, fNacimiento: e.target.value }))}
                    error={!!errors.fNacimiento}
                    helperText={errors.fNacimiento}
                    fullWidth
                  />
                  <TextField
                    label="Fecha de afiliación *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.fAfiliacion}
                    onChange={(e) => setForm((s) => ({ ...s, fAfiliacion: e.target.value }))}
                    error={!!errors.fAfiliacion}
                    helperText={errors.fAfiliacion}
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth error={!!errors.sexo}>
                    <InputLabel id="sexo-label">Sexo *</InputLabel>
                    <Select
                      labelId="sexo-label"
                      label="Sexo *"
                      value={form.sexo}
                      onChange={(e) => setForm((s) => ({ ...s, sexo: e.target.value }))}
                    >
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Femenino</MenuItem>
                    </Select>
                    <FormHelperText>{errors.sexo}</FormHelperText>
                  </FormControl>
                  <Box sx={{ flex: 1 }} />
                </Stack>

                <TextField
                  label="Reseña personal *"
                  value={form.resennaPersonal}
                  onChange={(e) => setForm((s) => ({ ...s, resennaPersonal: e.target.value }))}
                  error={!!errors.resennaPersonal}
                  helperText={errors.resennaPersonal}
                  fullWidth
                  multiline
                  minRows={3}
                  inputProps={{ maxLength: 200 }}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppLayout>
  );
}

