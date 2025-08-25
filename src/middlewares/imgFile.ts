import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import multer from "multer";

interface CloudinaryStorageParams {
  folder?: string;
  allowed_formats?: string[];
}

const storageParams: CloudinaryStorageParams = {
  folder: "Lokalqy",
  allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: storageParams,
});

/**
 * Middleware de Multer configurado para almacenar archivos en Cloudinary
 * @type {multer.Multer}
 * @property {CloudinaryStorage} storage - Almacenamiento configurado para Cloudinary
 * @property {string} params.folder - Carpeta destino en Cloudinary (default: "Lokalqy")
 * @property {string[]} params.allowed_formats - Formatos de imagen permitidos
 */
export const upload = multer({ storage });
