# Arquitectura del proyecto

El backend está organizado bajo una **arquitectura modular tipo MVC**, complementada con middlewares, utilidades y tipados de TypeScript.

## Estructura principal

```
src/
├── api/
│   ├── controllers/   # Lógica de negocio (Auth, Users, Properties, Vehicles)
│   ├── models/        # Esquemas de Mongoose
│   └── routes/        # Endpoints expuestos
├── config/            # Conexión con MongoDB y Cloudinary
├── middlewares/       # Autenticación, roles, gestión de archivos
├── types/             # Tipos e interfaces TypeScript
├── utils/             # Helpers (JWT, Cloudinary, roles)
└── index.ts           # Punto de entrada de la app
```

## Roles de cada capa

- Models → Definen la persistencia en MongoDB.
- Controllers → Procesan solicitudes y aplican lógica de negocio.
- Routes → Declaran los endpoints y delegan en los controllers.
- Middlewares → Encapsulan autenticación, roles, subida de imágenes.
- Config → Centraliza la conexión a servicios externos.
- Utils → Funciones auxiliares reutilizables.
- Types → Garantizan seguridad y claridad con TypeScript.
