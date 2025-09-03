# Resolución de problemas

Esta sección cubre problemas comunes que pueden surgir durante la instalación, configuración o uso del backend de LokaLqy App, junto con sus posibles soluciones.

## Problemas frecuentes

### Error de conexión a MongoDB

**Síntoma:** La aplicación no se inicia y muestra errores de conexión a la base de datos.

**Posibles causas y soluciones:**

1. **URL de conexión incorrecta en `.env`**

   - Verifica que `DB_URL` tenga el formato correcto: `mongodb://usuario:contraseña@host:puerto/base_de_datos`
   - Asegúrate de que las credenciales y el nombre de la base de datos sean correctos

2. **Servicio de MongoDB no está ejecutándose**

   - Si usas MongoDB local: ejecuta `sudo systemctl start mongod` (Linux) o inicia el servicio MongoDB manualmente (Windows)
   - Si usas MongoDB Atlas: verifica que tu IP esté en la lista de permitidas en la configuración de red

3. **Problemas de red o firewall**
   - Verifica que el puerto de MongoDB (por defecto 27017) esté accesible

### Error "JWT secret not found"

**Síntoma:** Error al iniciar la aplicación indicando que no se encuentra el secreto JWT.

**Solución:**

- Asegúrate de que el archivo `.env` existe y contiene la variable `JWT_SECRET` con un valor definido
- Verifica que el archivo `.env` esté en el directorio raíz del proyecto

### Problemas con Cloudinary

**Síntoma:** Errores al subir o eliminar imágenes.

**Soluciones:**

1. **Credenciales incorrectas**

   - Verifica que `CLOUD_NAME`, `API_KEY` y `API_SECRET` en el archivo `.env` sean correctos
   - Confirma que estas credenciales correspondan a tu cuenta de Cloudinary

2. **Carpeta no existe en Cloudinary**
   - La aplicación usa la carpeta `Lokalqy` por defecto
   - Asegúrate de que esta carpeta exista en tu cuenta de Cloudinary o cambia el valor en el código

### Error "Port already in use"

**Síntoma:** La aplicación no puede iniciarse porque el puerto está ocupado.

**Solución:**

- Cambia el puerto en la configuración de la aplicación (por defecto suele ser 3000 o 3001)
- Identifica qué proceso está usando el puerto y detenlo:

  ```bash
  # En Linux/Mac
  lsof -ti:3000 | xargs kill

  # O cambia el puerto temporalmente
  PORT=3001 npm start
  ```

### Problemas de compilación TypeScript

**Síntoma:** Errores al ejecutar `npm run build`.

**Soluciones:**

1. **TypeScript no instalado correctamente**

   - Ejecuta `npm install` para reinstalar todas las dependencias
   - Verifica que TypeScript esté en `devDependencies` en el `package.json`

2. **Errores de tipo en el código**
   - Ejecuta `npx tsc --noEmit` para identificar errores de tipo sin compilar
   - Corrige los errores reportados por TypeScript

### Errores de CORS en desarrollo

**Síntoma:** No se pueden hacer peticiones desde el frontend.

**Solución:**

- Verifica que el frontend esté configurado para apuntar al puerto correcto del backend
- Asegúrate de que la configuración CORS en el backend permita el origen de tu frontend

## Depuración

### Logs detallados

Habilita logging adicional agregando esta variable al archivo `.env`:

```env
DEBUG=*
# o más específicamente
DEBUG=app:*,mongoose:*
```

### Verificación de variables de entorno

Ejecuta este comando para verificar que todas las variables estén cargadas correctamente:

```bash
node -e "console.log(process.env)" | grep DB_URL
node -e "console.log(process.env)" | grep JWT
node -e "console.log(process.env)" | grep CLOUD
```

### Prueba de conexión a MongoDB

Puedes probar la conexión a MongoDB independientemente con:

```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(err => console.log('❌ Error de conexión:', err.message));
"
```

## Checklist de instalación

Si tienes problemas, verifica que completaste todos estos pasos:

1. [ ] Node.js versión 18+ instalada (`node --version`)
2. [ ] MongoDB instalado y ejecutándose
3. [ ] Cuenta de Cloudinary creada
4. [ ] Archivo `.env` creado desde `.env.example`
5. [ ] Variables de entorno configuradas correctamente
6. [ ] Dependencias instaladas (`npm install`)
7. [ ] Proyecto compilado (`npm run build`)

## Soporte adicional

Si los problemas persisten después de seguir estas soluciones:

1. **Revisa los issues existentes** en el repositorio de GitHub por si alguien ya reportó el mismo problema
2. **Crea un nuevo issue** con:

   - Descripción detallada del problema
   - Pasos para reproducirlo
   - Mensajes de error completos
   - Versiones de Node.js, npm y MongoDB
   - Sistema operativo

3. **Consulta la documentación oficial** de las tecnologías utilizadas:
   - [Mongoose](https://mongoosejs.com/)
   - [Express.js](https://expressjs.com/)
   - [Cloudinary](https://cloudinary.com/documentation)
   - [JSON Web Tokens](https://jwt.io/)

> 💡 **Tip:** Siempre verifica que estás usando la última versión estable de las dependencias con `npm outdated` y actualiza con `npm update`.
