# Usuarios — `/api/v1/users`

> Reglas:
>
> - `GET /users`: solo **admin**.
> - `GET/PUT /users/:id`: **admin** o **propietario** (según `isAdminOrSelf`).
> - `DELETE /users/:id`: **solo admin**.
> - `PUT /users/:id` acepta `multipart/form-data` (campo `image`).

## GET `/users` (admin)

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

## GET `/users/:id` (admin o dueño)

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

## PUT `/users/:id` (admin o dueño)

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

## DELETE `/users/:id` (admin)

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
