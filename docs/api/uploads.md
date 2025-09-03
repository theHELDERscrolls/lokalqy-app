# Subida de imágenes

El sistema utiliza **Cloudinary** para gestionar las imágenes de usuarios, propiedades y vehículos.

---

## Reglas

- Campo: `image` (`multipart/form-data`).
- Formatos permitidos: `jpg`, `jpeg`, `png`, `gif`, `webp`.
- Carpeta destino: `Lokalqy`.
- Al eliminar recursos, se borra también la imagen asociada en Cloudinary.

---

## Ejemplo con `curl`

```bash
curl -X POST http://localhost:3000/api/v1/vehicles \
  -H "Authorization: Bearer <TOKEN>" \
  -F "name=Toyota Corolla" \
  -F "type=car" \
  -F "plate=1234ABC" \
  -F "dailyRent=35" \
  -F "image=@./car.png"
```
