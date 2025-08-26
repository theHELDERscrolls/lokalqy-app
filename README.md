# LokaLqy App - Backend

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)

![status](https://img.shields.io/badge/status-stable-green.svg)

## 📑 Tabla de contenidos

- [[#Descripción]].
- [[#Motivación]].
- [[#Instalación]].
- [[#Características]].
- [[#Estructura del proyecto]].
- [[#Uso / API]].
- [[#Resolución de problemas]].
- [[#Licencia]].
- [[#Créditos]].

---

## Descripción

**LokaLqy App - Backend** es una aplicación desarrollada en **Node.js + Express + TypeScript** con **MongoDB** como base de datos y **Cloudinary** para la gestión de imágenes.

Está enfocada principalmente en **uso personal**, permitiendo a cada usuario gestionar de manera centralizada sus **propiedades y vehículos en alquiler**.  
El sistema facilita el manejo de información clave como nombre, estado, precios y otros detalles relevantes de cada recurso.

Aunque en su estado actual está pensado para un entorno particular, el proyecto ha sido diseñado con miras a **escalar y complejizar sus funcionalidades en el futuro**, incorporando más opciones de gestión y potencialmente ampliando su uso a escenarios multiusuario o colaborativos.

---

## Motivación

Este proyecto surge como parte del **Máster en FullStack Development**, con el objetivo de poner en práctica los conocimientos adquiridos en el desarrollo de aplicaciones completas.

El backend sirve tanto como **ejercicio académico** de consolidación tecnológica (API REST, autenticación JWT, conexión a servicios externos, persistencia en base de datos, tipado con TypeScript), como también como una **base real** para futuras evoluciones del sistema.

---

## Instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- Una base de datos [MongoDB](https://www.mongodb.com/) (local o en la nube)
- Una cuenta en [Cloudinary](https://cloudinary.com/) para el almacenamiento de imágenes

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/theHELDERscrolls/lokalqy-app.git

# Entrar en el directorio
cd lokalqy-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de entorno

El archivo `.env` debe contener las siguientes claves:

```env
DB_URL=          # URL de conexión a MongoDB
JWT_SECRET=      # Clave secreta para firmar JWT
CLOUD_NAME=      # Nombre del servicio Cloudinary
API_KEY=         # API Key de Cloudinary
API_SECRET=      # API Secret de Cloudinary
```

### Ejecución en desarrollo

```bash
npm run build
npm start
```

---

## Estructura del proyecto

El proyecto está desarrollado en **Node.js + Express + TypeScript**, siguiendo una arquitectura modular y organizada en distintas capas.  
A continuación se describe la estructura principal:

```plaintext
lokalqy-app/
├── LICENSE                 # Licencia del proyecto
├── README.md               # Documentación principal
├── package.json            # Dependencias y scripts de npm
├── tsconfig.json           # Configuración de TypeScript
└── src/
    ├── index.ts            # Punto de entrada de la aplicación
    │
    ├── api/                # Lógica de negocio principal (MVC)
    │   ├── controllers/    # Controladores: gestionan las peticiones y respuestas
    │   │   ├── auth.controller.ts      # Autenticación y login
    │   │   ├── property.controller.ts  # Gestión de propiedades
    │   │   ├── user.controller.ts      # Gestión de usuarios
    │   │   └── vehicle.controller.ts   # Gestión de vehículos
    │   │
    │   ├── models/         # Modelos de datos de Mongoose
    │   │   ├── property.model.ts       # Esquema de propiedades
    │   │   ├── user.model.ts           # Esquema de usuarios
    │   │   └── vehicle.model.ts        # Esquema de vehículos
    │   │
    │   └── routes/         # Rutas expuestas por la API
    │       ├── auth.route.ts           # Rutas de autenticación
    │       ├── property.route.ts       # Rutas para propiedades
    │       ├── user.route.ts           # Rutas para usuarios
    │       └── vehicle.route.ts        # Rutas para vehículos
    │
    ├── config/             # Configuración de servicios externos
    │   ├── connectCloudinary.ts        # Conexión a Cloudinary
    │   ├── connectDB.ts                # Conexión a MongoDB
    │   └── index.ts
    │
    ├── middlewares/        # Middlewares personalizados
    │   ├── hasRole.ts                  # Verificación de roles de usuario
    │   ├── imgFile.ts                  # Gestión de archivos de imagen (Multer + Cloudinary)
    │   ├── isAuth.ts                   # Validación de autenticación con JWT
    │   └── index.ts
    │
    ├── types/              # Definiciones y tipados de TypeScript
    │   ├── authenticatedRequest.ts     # Extensión de la Request con datos del usuario autenticado
    │   ├── property.type.ts            # Tipado de propiedades
    │   ├── user.type.ts                # Tipado de usuarios
    │   └── vehicle.type.ts             # Tipado de vehículos
    │
    └── utils/              # Utilidades y helpers
        ├── canChageRole.ts             # Verifica si un rol puede ser modificado
        ├── deleteImgFile.ts            # Elimina archivos de imagen en Cloudinary
        ├── getJwtSecret.ts             # Obtiene la clave JWT del entorno
        ├── isAdminOrSelf.ts            # Valida si un usuario es admin o dueño del recurso
        └── jwt.ts                      # Funciones auxiliares para manejo de JWT
```

Esta estructura sigue el patrón clásico de **MVC (Model-View-Controller)**, donde:

- **Models** definen los esquemas de datos.
- **Controllers** contienen la lógica de negocio y procesan las solicitudes.
- **Routes** exponen los endpoints de la API.
- **Middlewares** encapsulan validaciones y lógica repetitiva.
- **Config** centraliza conexiones a servicios externos.
- **Utils** proporciona funciones auxiliares reutilizables.
- **Types** garantiza seguridad de tipos gracias a TypeScript.

---

## Características

El backend de **LokaLqy App** incluye las siguientes funcionalidades principales:

- 🔑 **Autenticación con JWT**

  - Registro y login de usuarios.
  - Middleware `isAuth` para proteger rutas privadas.
  - Manejo seguro de contraseñas con `bcrypt`.

- 👤 **Gestión de usuarios**

  - Creación, consulta, actualización y eliminación de usuarios.
  - Control de roles mediante middlewares (`hasRole`, `canChangeRole`).
  - Validación de acceso con `isAdminOrSelf` para que los usuarios solo gestionen su propia información.

- 🏠 **Gestión de propiedades**

  - CRUD completo de propiedades en alquiler.
  - Asociación de propiedades con usuarios.

- 🚗 **Gestión de vehículos**

  - CRUD completo de vehículos en alquiler.
  - Asociación de vehículos con usuarios.

- 🖼 **Gestión de imágenes**

  - Subida de archivos con `multer`.
  - Almacenamiento y manejo en la nube con **Cloudinary**.
  - Eliminación de imágenes mediante el utilitario `deleteImgFile`.

- 🗄 **Base de datos MongoDB**

  - Modelado con **Mongoose** para usuarios, propiedades y vehículos.
  - Tipado adicional con interfaces de **TypeScript**.

- 🧩 **Arquitectura modular**

  - Separación en capas **Routes / Controllers / Models**.
  - Middlewares reutilizables para autenticación, roles y manejo de archivos.
  - Helpers (`utils/`) para funciones auxiliares como JWT o control de roles.

- 🛠 **Desarrollado en TypeScript**
  - Tipado fuerte y definido en `src/types/`.
  - Facilita el mantenimiento y escalabilidad futura.

---

## Uso / API

**Base URL:** `/api/v1`  
**Auth:** JWT en header `Authorization: Bearer <token>`

Todas las colecciones usan `timestamps: true`, por lo que las respuestas incluyen:

```json
{
  "createdAt": "2025-08-20T12:34:56.789Z",
  "updatedAt": "2025-08-21T09:10:11.123Z"
}
```

---

### Autenticación — `/api/v1/auth`

#### POST `/register`

Crea usuario (rol por defecto: `user`).

```json
// body
{
  "name": "John",
  "email": "john@example.com",
  "password": "Secreta123"
}
```

```json
// 201 Created
{
  "message": "Usuario registrado",
  "user": {
    "_id": "66cfa9... ",
    "name": "John",
    "email": "john@example.com",
    "role": "user",
    "image": null,
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-20T12:34:56.789Z",
    "__v": 0
  }
}
```

#### POST `/login`

Devuelve token y usuario (sin `password`).

```json
// body
{
  "email": "john@example.com",
  "password": "Secreta123"
}
```

```json
// 200 OK
{
  "token": "<JWT_TOKEN>",
  "user": {
    "_id": "66cfa9... ",
    "name": "John",
    "email": "john@example.com",
    "role": "user",
    "image": null,
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-20T12:34:56.789Z",
    "__v": 0
  }
}
```

---

### Usuarios — `/api/v1/users`

> Reglas:
>
> - `GET /users`: solo **admin**.
> - `GET/PUT /users/:id`: **admin** o **propietario** (según `isAdminOrSelf`).
> - `DELETE /users/:id`: **solo admin**.
> - `PUT /users/:id` acepta `multipart/form-data` (campo `image`).

#### GET `/users` (admin)

```json
// 200 OK
[
  {
    "_id": "66cfa9...",
    "name": "John",
    "email": "john@example.com",
    "role": "user",
    "image": null,
	"properties": [
      { "_id": "66cfb0...", "name": "Apartamento Centro", ... },
      { "_id": "66cfb1...", "name": "Casa Rural", ... }
    ],
	"vehicles": [
      { "_id": "66cfb9...", "name": "Toyota Corolla", ... },
      { "_id": "66cfba...", "name": "Honda CB500", ... }
	],
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-21T09:10:11.123Z",
    "__v": 0
  }
]
```

#### GET `/users/:id` (admin o dueño)

```json
// 200 OK
{
  "_id": "66cfa9...",
  "name": "John",
  "email": "john@example.com",
  "role": "user",
  "image": null,
  "properties": [
    { "_id": "66cfb0...", "name": "Apartamento Centro", ... },
    { "_id": "66cfb1...", "name": "Casa Rural", ... }
  ],
  "vehicles": [
    { "_id": "66cfb9...", "name": "Toyota Corolla", ... },
    { "_id": "66cfba...", "name": "Honda CB500", ... }
  ],
  "createdAt": "2025-08-20T12:34:56.789Z",
  "updatedAt": "2025-08-21T09:10:11.123Z",
  "__v": 0
}
```

#### PUT `/users/:id` (admin o dueño)

`multipart/form-data` (para imagen) o `application/json`.

```json
// body (JSON)
{
  "name": "John Updated"
}
```

```json
// 200 OK
{
  "_id": "66cfa9...",
  "name": "John Updated",
  "email": "john@example.com",
  "role": "user",
  "image": "https://res.cloudinary.com/.../Lokalqy/xxxx.jpg",
  "properties": [
    { "_id": "66cfb0...", "name": "Apartamento Centro", ... },
    { "_id": "66cfb1...", "name": "Casa Rural", ... }
  ],
  "vehicles": [
    { "_id": "66cfb9...", "name": "Toyota Corolla", ... },
    { "_id": "66cfba...", "name": "Honda CB500", ... }
  ],
  "createdAt": "2025-08-20T12:34:56.789Z",
  "updatedAt": "2025-08-22T14:00:00.000Z",
  "__v": 0
}
```

#### DELETE `/users/:id` (admin)

```json
// 200 OK
{
  "message": "Usuario eliminado correctamente",
  "userDeleted": {
    "_id": "66cfa9...",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "admin",
    "image": "https://res.cloudinary.com/.../Lokalqy/xxxx.jpg",
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-22T14:00:00.000Z",
    "__v": 0
  }
}
```

> **Índices únicos (propiedades):**
>
> - `(name, owner)` y `(address, owner)` únicos (collation `es`, `strength: 2`) - evita duplicados por usuario.

---

### Vehículos — `/api/v1/vehicles`

> Requieren **isAuth** (los controladores filtran por `owner`).  
> Carga de imagen: `multipart/form-data` con campo `image`.

**Modelo (resumen):**

- `name: string` (3–100)
- `type: "car" | "motorcycle" | "truck" | "van" | "other"`
- `plate: string` (única, regex `^\d{4}[A-Z]{3}$` → ej: `1234ABC`)
- `status: "available" | "rented" | "maintenance"`
- `dailyRent: number` (>=0)
- `expenses: number` (>=0)
- `paid: boolean` (default `false`)
- `image?: string`
- `owner: ObjectId (ref users)`
- `createdAt`, `updatedAt`

#### GET `/vehicles`

```json
// 200 OK
[
  {
    "_id": "66cfb9...",
    "name": "Toyota Corolla",
    "type": "car",
    "plate": "1234ABC",
    "status": "available",
    "dailyRent": 35,
    "expenses": 5,
    "paid": false,
    "image": "https://res.cloudinary.com/.../Lokalqy/car1.jpg",
    "owner": "66cfa9...",
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-21T09:10:11.123Z",
    "__v": 0
  }
]
```

#### GET `/vehicles/:id`

```json
// 200 OK
{ "...": "Mismo formato que arriba con createdAt/updatedAt" }
```

#### POST `/vehicles`

```json
// body
{
  "name": "Toyota Corolla",
  "type": "car",
  "plate": "1234ABC",
  "status": "available",
  "dailyRent": 35,
  "expenses": 5,
  "paid": false
}
```

```json
// 201 Created
{
  "_id": "66cfb9...",
  "name": "Toyota Corolla",
  "type": "car",
  "plate": "1234ABC",
  "status": "available",
  "dailyRent": 35,
  "expenses": 5,
  "paid": false,
  "image": "https://res.cloudinary.com/.../Lokalqy/car1.jpg",
  "owner": "66cfa9...",
  "createdAt": "2025-08-20T12:34:56.789Z",
  "updatedAt": "2025-08-20T12:34:56.789Z",
  "__v": 0
}
```

#### PUT `/vehicles/:id`

```json
{
  "status": "maintenance",
  "dailyRent": 40
}
```

#### DELETE `/vehicles/:id`

```json
// 200 OK
{
  "message": "Vehículo eliminado correctamente",
  "vehicleDeleted": {
    "_id": "66cfb9...",
    "name": "Toyota Corolla",
    "plate": "1234ABC",
    "image": "https://res.cloudinary.com/.../Lokalqy/car1.jpg",
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-22T14:00:00.000Z",
    "__v": 0
  }
}
```

---

### Propiedades — `/api/v1/properties`

> Todas requieren **isAuth**. Devuelven solo recursos del **dueño (req.user)**.  
> Carga de imagen: `multipart/form-data` con campo `image`.

**Modelo (resumen):**

- `name: string` (3–100)
- `type: "apartment" | "rural_house" | "flat" | "studio" | "other"`
- `address: string` (5–200)
- `status: "available" | "rented" | "maintenance"`
- `monthlyRent: number` (>=0)
- `expenses: number` (>=0)
- `paid: boolean` (default `false`)
- `image?: string` (URL Cloudinary)
- `owner: ObjectId (ref users)`
- `createdAt`, `updatedAt`

#### GET `/properties

```json
// 200 OK
[
  {
    "_id": "66cfb0...",
    "name": "Apartamento Centro",
    "type": "flat",
    "address": "C/ Mayor 1, Madrid",
    "status": "available",
    "monthlyRent": 1200,
    "expenses": 100,
    "paid": false,
    "image": "https://res.cloudinary.com/.../Lokalqy/prop1.jpg",
    "owner": "66cfa9...",
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-21T09:10:11.123Z",
    "__v": 0
  }
]
```

#### GET `/properties/:id`

```json
// 200 OK
{ "...": "Mismo formato que arriba con createdAt/updatedAt" }
```

#### POST `/properties`

`multipart/form-data` (para imagen) o `application/json`

```json
// body
{
  "name": "Apartamento Centro",
  "type": "flat",
  "address": "C/ Mayor 1, Madrid",
  "status": "available",
  "monthlyRent": 1200,
  "expenses": 100,
  "paid": false
}
```

```json
// 201 Created
{
  "_id": "66cfb0...",
  "name": "Apartamento Centro",
  "type": "flat",
  "address": "C/ Mayor 1, Madrid",
  "status": "available",
  "monthlyRent": 1200,
  "expenses": 100,
  "paid": false,
  "image": "https://res.cloudinary.com/.../Lokalqy/prop1.jpg",
  "owner": "66cfa9...",
  "createdAt": "2025-08-20T12:34:56.789Z",
  "updatedAt": "2025-08-20T12:34:56.789Z",
  "__v": 0
}
```

#### PUT `/properties/:id`

```json
// body
{
  "status": "rented",
  "paid": true,
  "monthlyRent": 1250
}
```

```json
// 200 OK
{ "...": "Propiedad actualizada + createdAt/updatedAt actualizados" }
```

#### DELETE `/properties/:id`

```json
// 200 OK
{
  "message": "Propiedad eliminada correctamente",
  "propertyDeleted": {
    "_id": "66cfb0...",
    "name": "Apartamento Centro",
    "image": "https://res.cloudinary.com/.../Lokalqy/prop1.jpg",
    "createdAt": "2025-08-20T12:34:56.789Z",
    "updatedAt": "2025-08-22T14:00:00.000Z",
    "__v": 0
  }
}
```

> Índices únicos (propiedades):
>
> - `(name, owner)` y `(address, owner)` únicos (collation `es`, `strength: 2`) — evita duplicados por usuario.

---

### Subida de imágenes (Cloudinary)

- Campo: `image` (`multipart/form-data`).
- Formatos permitidos: `jpg`, `jpeg`, `png`, `gif`, `webp`.
- Carpeta destino: `Lokalqy`.
- Al eliminar recursos, se borra la imagen asociada en Cloudinary.

---

## Resolución de problemas

Esta sección cubre problemas comunes que pueden surgir durante la instalación, configuración o uso del backend de LokaLqy App, junto con sus posibles soluciones.

## Problemas frecuentes

#### Error de conexión a MongoDB

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

#### Error "JWT secret not found"

**Síntoma:** Error al iniciar la aplicación indicando que no se encuentra el secreto JWT.

**Solución:**

- Asegúrate de que el archivo `.env` existe y contiene la variable `JWT_SECRET` con un valor definido
- Verifica que el archivo `.env` esté en el directorio raíz del proyecto

#### Problemas con Cloudinary

**Síntoma:** Errores al subir o eliminar imágenes.

**Soluciones:**

1. **Credenciales incorrectas**

   - Verifica que `CLOUD_NAME`, `API_KEY` y `API_SECRET` en el archivo `.env` sean correctos
   - Confirma que estas credenciales correspondan a tu cuenta de Cloudinary

2. **Carpeta no existe en Cloudinary**
   - La aplicación usa la carpeta `Lokalqy` por defecto
   - Asegúrate de que esta carpeta exista en tu cuenta de Cloudinary o cambia el valor en el código

#### Error "Port already in use"

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

#### Problemas de compilación TypeScript

**Síntoma:** Errores al ejecutar `npm run build`.

**Soluciones:**

1. **TypeScript no instalado correctamente**

   - Ejecuta `npm install` para reinstalar todas las dependencias
   - Verifica que TypeScript esté en `devDependencies` en el `package.json`

2. **Errores de tipo en el código**
   - Ejecuta `npx tsc --noEmit` para identificar errores de tipo sin compilar
   - Corrige los errores reportados por TypeScript

#### Errores de CORS en desarrollo

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

---

## Licencia

Este proyecto está licenciado bajo la [MIT License](./LICENSE).  
© 2025 Helder Ruiz. Todos los derechos reservados.

---

## Créditos

- Desarrollado por **Helder Ruiz** como parte del **Máster en FullStack Development**.
- Inspirado y apoyado en:
  - Documentación oficial de **Node.js**, **Express** y **TypeScript**.
  - Comunidad de **MongoDB** y **Cloudinary**.
  - Buenas prácticas de arquitectura **MVC** y patrones de diseño en backends modernos.

> Gracias a la comunidad open-source por proveer herramientas y recursos que hicieron posible este proyecto.
