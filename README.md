# API de Usuarios

API REST para gestión de usuarios con autenticación JWT.

## Despliegue en Render

### Pasos para desplegar:

1. Crea una cuenta en [Render](https://render.com/) si aún no la tienes.

2. Conecta tu repositorio de GitHub con Render.

3. Crea un nuevo servicio web:
   - Selecciona "Web Service"
   - Conecta tu repositorio
   - Nombre: api-usuario (o el que prefieras)
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start

4. Configura las variables de entorno:
   - DB_HOST=dpg-cvq6m0be5dus73f2vge0-a.oregon-postgres.render.com
   - DB_USER=api_user_2qfc_user
   - DB_PASS=7WdQGXthhOqyYoHiaPQPKbnqL25LCYho
   - DB_NAME=api_user_2qfc
   - JWT_SECRET=supersecretkey (recomendable cambiar a uno más seguro)
   - PORT=10000

5. Haz clic en "Create Web Service"

### Diagnóstico de conexión a la base de datos

Para diagnosticar problemas de conexión a la base de datos, ejecuta:

```bash
npm run test:connection
```

Este script probará cuatro métodos diferentes de conexión:
1. Cliente básico con SSL
2. Cliente sin SSL
3. Cliente con configuración SSL avanzada
4. Conexión usando URI

### Conexión a la base de datos PostgreSQL

Para conectarte a la base de datos PostgreSQL usando psql, utiliza el siguiente comando:

```bash
psql -h dpg-cvq6m0be5dus73f2vge0-a.oregon-postgres.render.com -d api_user_2qfc -U api_user_2qfc_user -p 5432
```

O para ejecutar una consulta rápida:

```bash
psql -h dpg-cvq6m0be5dus73f2vge0-a.oregon-postgres.render.com -d api_user_2qfc -U api_user_2qfc_user -p 5432 -c "SELECT NOW();"
```

También puedes usar el archivo `conectar-postgres.bat` incluido en el repositorio.

### Conexión desde el frontend

Para conectar tu frontend a esta API:

```javascript
const API_URL = 'https://api-usuario.onrender.com/api';

// Ejemplo de login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}
```

## Endpoints disponibles

- `GET /`: Estado del servidor y conexión a la base de datos
- `POST /api/register`: Registro de usuarios
- `POST /api/login`: Inicio de sesión
- `GET /api/users`: Obtener todos los usuarios (requiere autenticación)
