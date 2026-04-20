# Prueba Técnica React JS (Clientes)

SPA en **React 17** con **Material UI**, **React Router**, **Axios** y **Context API** para:

- Autenticación (Login/Registro)
- Mantenimiento de clientes (listar/filtrar/crear/editar/eliminar)

API base: `https://pruebareactjs.test-class.com/Api`

## Ejecutar

```bash
npm install
npm start
```

Tests:

```bash
npm test -- --watchAll=false
```

## Rutas

- **Públicas**
  - `/login`
  - `/register`
  - `/404`
- **Protegidas** (requieren token)
  - `/` (Home)
  - `/clientes` (Consulta clientes)
  - `/clientes/nuevo` (Crear cliente)
  - `/clientes/:id` (Editar cliente)

## Autenticación (storage)

- **Sesión**: se guarda en `localStorage` bajo `isAuth.auth`:
  - `token`, `userid`, `username`
- **Recuérdame**: guarda el username en `localStorage` bajo `isAuth.rememberedUsername`

Al recibir **401** desde el API, se ejecuta `logout()` y se requiere volver a iniciar sesión.

## Endpoints usados (Swagger)

### Login

- `POST /api/Authenticate/login`
- Request:

```json
{ "username": "string", "password": "string" }
```

- Response esperado:
  - `token`, `expiration`, `userid`, `username`

### Registro

- `POST /api/Authenticate/register`
- Request:

```json
{ "username": "string", "email": "user@example.com", "password": "string" }
```

### Intereses

- `GET /api/Intereses/Listado`
- Response: `[{ "id": "uuid", "descripcion": "string" }]`

### Consulta clientes

- `POST /api/Cliente/Listado` (Bearer token)
- Request:

```json
{ "identificacion": "string|null", "nombre": "string|null", "usuarioId": "string" }
```

- Response: `[{ "id": "uuid", "identificacion": "string", "nombre": "string", "apellidos": "string" }]`

### Obtener cliente (editar)

- `GET /api/Cliente/Obtener/{IdCliente}` (Bearer token)

### Eliminar cliente

- `DELETE /api/Cliente/Eliminar/{IdCliente}` (Bearer token)

### Crear cliente

- `POST /api/Cliente/Crear` (Bearer token)
- Request (según Swagger `ClienteCrear`):

```json
{
  "nombre": "string",
  "apellidos": "string",
  "identificacion": "string",
  "celular": "string",
  "otroTelefono": "string",
  "direccion": "string",
  "fNacimiento": "date-time",
  "fAfiliacion": "date-time",
  "sexo": "M|F",
  "resennaPersonal": "string|null",
  "imagen": "base64|null",
  "interesFK": "uuid",
  "usuarioId": "string"
}
```

### Actualizar cliente

- `POST /api/Cliente/Actualizar` (Bearer token)
- Request (según Swagger `ClienteActualizar`): igual a crear, pero con:
  - `id: uuid`

## Mapeo de campos (API ↔ formulario)

Al **editar**, el API devuelve `DetalleCliente_DTO`:

- `telefonoCelular` → formulario `celular`
- `resenaPersonal` → formulario `resennaPersonal`
- `interesesId` → formulario `interesFK`

Al **guardar**, el formulario envía el payload de Swagger:

- formulario `celular` → `celular`
- formulario `resennaPersonal` → `resennaPersonal`
- formulario `interesFK` → `interesFK`

Fechas:
- UI usa `<input type="date">` (yyyy-mm-dd).
- Se envía `date-time` ISO (medianoche local en ISO) para cumplir el esquema Swagger.

Imagen:
- Se almacena/envía como **base64** (sin el prefijo `data:image/...;base64,`).

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
