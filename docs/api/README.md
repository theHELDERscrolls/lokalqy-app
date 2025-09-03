# 📚 Documentación de la API - LokaLqy App

Documentación completa de todos los endpoints, autenticación, permisos y ejemplos de uso de **LokaLqy API**.

---

## Índice de la API

| Sección                               | Descripción                                        | Endpoints              |
| ------------------------------------- | -------------------------------------------------- | ---------------------- |
| [🔐 Autenticación](authentication.md) | Registro, login y obtención de tokens JWT          | `/api/v1/auth/*`       |
| [👥 Usuarios](users.md)               | CRUD de usuarios, gestión de imágenes y relaciones | `/api/v1/users/*`      |
| [🚗 Vehículos](vehicles.md)           | CRUD de vehículos, estados, rentas y pagos         | `/api/v1/vehicles/*`   |
| [🏠 Propiedades](properties.md)       | CRUD de propiedades, estados, rentas y pagos       | `/api/v1/properties/*` |
| [🖼️ Imágenes](uploads.md)             | Subida y borrado de imágenes con Cloudinary        | Integrado en recursos  |

---

## URL Base

**Desarrollo:** `http://localhost:3000/api/v1`  
**Producción:** `https://api.tudominio.com/api/v1`

Todos los endpoints están bajo el prefijo `/api/v1/`.

---

## Autenticación Rápida

### Login y obtener token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Secreta123"
  }'
```

## Usar token en request

```bash
curl -H "Authorization: Bearer <tu_token_jwt>" \
     http://localhost:3000/api/v1/users/
```

## 🚦 Códigos de Estado HTTP

| Código  | Descripción           | Cuándo se usa                    |
| ------- | --------------------- | -------------------------------- |
| **200** | OK                    | Operación exitosa                |
| **201** | Created               | Recurso creado exitosamente      |
| **400** | Bad Request           | Datos inválidos                  |
| **401** | Unauthorized          | Token faltante o inválido        |
| **403** | Forbidden             | Sin permisos para esta operación |
| **404** | Not Found             | Recurso no encontrado            |
| **500** | Internal Server Error | Error del servidor               |

## 🛠️ Headers Requeridos

### Para requests autenticados

```bash
Authorization: Bearer <access_token> Content-Type: application/json
```

### Para requests públicos

```bash
Content-Type: application/json
```

## 🔗 Enlaces Útiles

- **[Autenticación](authentication.md)** - Login, registro, JWT
- **[Usuarios](users.md)** - Gestión de usuarios
- **[Vehículos](vehicles.md)** - Configuración de vehículos
- **[Propiedades](properties.md)** - Configuración de vehículos

---
