# Vehículos — `/api/v1/vehicles`

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

## GET `/vehicles`

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

## GET `/vehicles/:id`

```json
// 200 OK
{ "...": "Mismo formato que arriba con createdAt/updatedAt" }
```

## POST `/vehicles`

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

## PUT `/vehicles/:id`

```json
{
  "status": "maintenance",
  "dailyRent": 40
}
```

## DELETE `/vehicles/:id`

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
