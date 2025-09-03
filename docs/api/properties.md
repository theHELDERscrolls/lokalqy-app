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
