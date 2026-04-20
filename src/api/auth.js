export function createAuthApi(http) {
  return {
    login: async ({ username, password }) => {
      const { data } = await http.post('/api/Authenticate/login', {
        username,
        password,
      });
      return data;
    },
    register: async ({ username, email, password }) => {
      const { data } = await http.post('/api/Authenticate/register', {
        username,
        email,
        password,
      });
      return data;
    },
  };
}

