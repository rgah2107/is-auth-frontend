export function createInteresesApi(http) {
  return {
    listado: async () => {
      const { data } = await http.get('/api/Intereses/Listado');
      return data;
    },
  };
}

