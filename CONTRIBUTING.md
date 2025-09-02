# Guía de Contribución

¡Gracias por tu interés en contribuir a LokaLqy App! 🎉

Esta guía te ayudará a entender cómo puedes colaborar con este proyecto de manera efectiva.

## ¿Cómo puedo contribuir?

### 1. Reportar errores (Bugs)

- Busca primero en los [issues existentes](https://github.com/theHELDERscrolls/lokalqy-app/issues) para evitar duplicados
- Si no existe, crea un nuevo issue con la etiqueta `bug`
- Incluye:
  - Descripción clara del problema
  - Pasos para reproducirlo
  - Comportamiento esperado vs. actual
  - Capturas de pantalla si es aplicable
  - Versiones de Node.js, npm y MongoDB

### 2. Solicitar nuevas funcionalidades

- Usa la etiqueta `enhancement`
- Describe la funcionalidad con detalle
- Explica el valor que aportaría al proyecto
- Si es posible, propone una implementación

### 3. Contribuir con código

- Sigue el proceso estándar de fork y pull request
- Asegúrate de que tu código sigue las convenciones del proyecto

## Proceso de desarrollo

1. **Haz un fork** del repositorio.
2. Crea una nueva rama para tu funcionalidad o corrección:

```bash
git checkout -b feature/nueva-funcionalidad
```

3. Realiza tus cambios y asegúrate de que todo funcione correctamente.
4. Ejecuta los tests (si existen) o prueba manualmente los endpoints.
5. Haz commit de tus cambios con un mensaje claro:

```bash
git commit -m "feat: añade nueva funcionalidad X"
```

6. **Sube tu rama** a tu fork:

```bash
git push origin feature/nueva-funcionalidad
```

7. Abre una **Pull Request** hacia la rama `main` de este repositorio.

### Reglas básicas

- Sigue la convención de commits de tipo [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).  
   Ejemplos:
  - `feat: agrega endpoint para exportar reportes`
  - `fix: corrige validación de emails`
  - `docs: mejora sección de instalación`
- Usa TypeScript de manera estricta (sin `any` innecesarios).
- Mantén la consistencia con la arquitectura del proyecto (MVC + middlewares + utils).
- Documenta brevemente tus cambios en el README o en comentarios de código si es necesario.
