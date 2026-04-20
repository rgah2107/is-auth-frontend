export function createClientesApi(http) {
  return {
    listar: async ({ identificacion, nombre, usuarioId }) => {
      const { data } = await http.post('/api/Cliente/Listado', {
        identificacion: identificacion || null,
        nombre: nombre || null,
        usuarioId,
      });
      return data;
    },
    obtener: async (idCliente) => {
      const { data } = await http.get(`/api/Cliente/Obtener/${idCliente}`);
      return data;
    },
    eliminar: async (idCliente) => {
      const { data } = await http.delete(`/api/Cliente/Eliminar/${idCliente}`);
      return data;
    },
    crear: async (payload) => {
      const { data } = await http.post('/api/Cliente/Crear', payload);
      return data;
    },
    actualizar: async (payload) => {
      const { data } = await http.post('/api/Cliente/Actualizar', payload);
      return data;
    },
  };
}

