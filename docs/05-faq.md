# Preguntas frecuentes (FAQ)

### ¿Puedo usar este backend en producción?

Sí, aunque está orientado a uso personal y académico. Para producción se recomienda:

- Añadir tests automatizados.
- Configurar despliegue en un entorno seguro (ej. Docker, VPS, Render, Vercel).
- Monitoreo y logs adecuados.

### ¿Cómo puedo probar la API?

Puedes usar herramientas como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/).  
Recuerda que todas las rutas (excepto `auth/register` y `auth/login`) requieren token JWT en el header.

### ¿Qué pasa si subo imágenes muy grandes?

Cloudinary las procesará, pero se recomienda limitarlas en el frontend antes de enviarlas.

### ¿Por qué TypeScript y no JavaScript puro?

TypeScript asegura tipado estático, lo que facilita mantenimiento y escalabilidad en proyectos que crecerán a futuro.
