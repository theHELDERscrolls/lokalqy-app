import cloudinary from "cloudinary";

/**
 * Configura y establece la conexión con Cloudinary usando las variables de entorno
 * @throws {Error} Si faltan variables de configuración requeridas
 * @example
 * connectCloudinary();
 * // Console: "Conectado con éxito a Cloudinary" o "Error configuring Cloudinary: [error]"
 */
export const connectCloudinary = () => {
  try {
    const cloud_name = process.env.CLOUD_NAME;
    const api_key = process.env.API_KEY;
    const api_secret = process.env.API_SECRET;

    if (!cloud_name || !api_key || !api_secret) {
      throw new Error("Cloudinary config is missing");
    }

    cloudinary.v2.config({
      cloud_name,
      api_key,
      api_secret,
    });

    console.log("Conectado con éxito a Cloudinary");
  } catch (error) {
    console.error("Error configuring Cloudinary:", error);
  }
};
