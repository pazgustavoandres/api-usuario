# Instrucciones para completar el Hito 4

## 1. Despliegue de la aplicación cliente (2 puntos)

### Opción usando Netlify:

1. Crea una cuenta en [Netlify](https://www.netlify.com/) si aún no tienes una
2. Sube tu código a un repositorio GitHub
3. En Netlify, haz clic en "New site from Git"
4. Selecciona tu repositorio
5. Configura los ajustes de despliegue:
   - Build command: `npm run build` (o el comando que uses para compilar tu proyecto)
   - Publish directory: `dist` o `build` (dependiendo de tu framework)
6. Configura las variables de entorno:
   - `VITE_API_URL=https://api-usuario.onrender.com/api`
7. Haz clic en "Deploy site"

## 2. Despliegue de la aplicación backend (2 puntos)

1. Asegúrate de que tu backend ya está configurado para producción con las variables de entorno correctas
2. Inicia sesión en [Render](https://render.com/)
3. Haz clic en "New +" y selecciona "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura el servicio:
   - Name: api-usuario (o el nombre que prefieras)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Añade las variables de entorno:
   - `DB_HOST=dpg-cvq6m0be5dus73f2vge0-a.oregon-postgres.render.com`
   - `DB_USER=api_user_2qfc_user`
   - `DB_PASS=7WdQGXthhOqyYoHiaPQPKbnqL25LCYho`
   - `DB_NAME=api_user_2qfc`
   - `JWT_SECRET=supersecretkey` (recomendable usar una clave más segura)
   - `PORT=10000`
7. Haz clic en "Create Web Service"

## 3. Despliegue de la base de datos (2 puntos)

Tu base de datos ya está desplegada en Render. Los detalles de conexión son:

- **Host**: dpg-cvq6m0be5dus73f2vge0-a.oregon-postgres.render.com
- **Database**: api_user_2qfc
- **User**: api_user_2qfc_user
- **Password**: 7WdQGXthhOqyYoHiaPQPKbnqL25LCYho

Si necesitas gestionar tu base de datos directamente, puedes usar:

1. El panel de control de Render
2. pgAdmin (GUI para PostgreSQL)
3. El archivo `conectar-postgres.bat` que hemos creado para conectarte mediante la línea de comandos

## 4. Integración de aplicación cliente con backend en producción (4 puntos)

1. Asegúrate de que en tu aplicación cliente (frontend) todas las peticiones API apunten a la URL del backend en producción:

```javascript
// Ejemplo en React usando Axios o fetch
const API_URL = 'https://tu-backend-en-render.onrender.com/api';

// Función de login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Error de login:', error);
    throw error;
  }
}
```

2. Prueba todas las funcionalidades:
   - Registro de usuarios
   - Login/Autenticación
   - Obtención de datos
   - Operaciones CRUD

3. Verifica que los datos se estén guardando correctamente en la base de datos:
   - Usa el acceso a la base de datos que proporcionamos
   - Comprueba que los registros se están creando/modificando según las operaciones realizadas

## Verificación final

Para asegurarte de que todo funciona correctamente:

1. Accede a tu aplicación frontend a través de la URL proporcionada por Netlify
2. Realiza un registro de usuario nuevo
3. Inicia sesión con ese usuario
4. Verifica que puedes realizar todas las operaciones
5. Conéctate a la base de datos y confirma que los datos se han guardado

Con estos pasos habrás completado todos los requisitos del Hito 4. 