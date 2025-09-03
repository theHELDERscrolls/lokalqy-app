# Instalación

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- Cuenta en [Cloudinary](https://cloudinary.com/)

## Pasos de instalación

```bash
# Clonar el repositorio
git clone https://github.com/theHELDERscrolls/lokalqy-app.git

# Entrar en el directorio
cd lokalqy-app

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
```

## Variables de entorno

```env
DB_URL=          # URL de conexión a MongoDB
JWT_SECRET=      # Clave secreta JWT
CLOUD_NAME=      # Cloudinary cloud name
API_KEY=         # Cloudinary API Key
API_SECRET=      # Cloudinary API Secret
```

## Ejecución en desarrollo

```bash
npm run build
npm start
```
