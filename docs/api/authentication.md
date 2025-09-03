# Autenticación — `/api/v1/auth`

## POST `/register`

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

## POST `/login`

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
