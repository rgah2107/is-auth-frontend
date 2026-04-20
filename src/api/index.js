import { createHttpClient, getApiErrorMessage } from './http';
import { createAuthApi } from './auth';
import { createClientesApi } from './clientes';
import { createInteresesApi } from './intereses';

export function createApi({ getAuthToken, onUnauthorized } = {}) {
  const http = createHttpClient({ getAuthToken, onUnauthorized });
  return {
    http,
    errorMessage: getApiErrorMessage,
    auth: createAuthApi(http),
    clientes: createClientesApi(http),
    intereses: createInteresesApi(http),
  };
}

