import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";

/**
 * Establece una conexión con la base de datos MongoDB utilizando la URL proporcionada
 * en las variables de entorno y opciones de configuración específicas.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Una promesa que se resuelve cuando la conexión es exitosa
 * @throws {Error} Si la variable de entorno DB_URL no está definida
 * @throws {Error} Si ocurre un error durante el intento de conexión
 *
 * @example
 * // Uso básico
 * connectDB();
 */
export const connectDB = async (): Promise<void> => {
  // Obtenemos la URL de la base de datos de las variables de entorno
  const dbUrl: string | undefined = process.env.DB_URL;

  // Validamos que la URL exista
  if (!dbUrl) {
    throw new Error("La variable de entorno DB_URL no está definida en el archivo .env");
  }

  try {
    // Configuramos las opciones para la conexión a MongoDB
    const options: ConnectOptions = {
      retryWrites: true, // Habilita reintentos de escritura si fallan
      w: "majority",     // Espera confirmación de la mayoría de los nodos del replica set
    };

    // Intentamos conectar a MongoDB usando Mongoose
    await mongoose.connect(dbUrl, options);

    // Mensaje de éxito si la conexión se establece
    console.log("✅ Conectado con éxito a MongoDB");
  } catch (error) {
    // Manejo de errores detallado
    console.error(
      "❌ Error al conectar con MongoDB",
      error instanceof Error ? error.message : error
    );

    // Salimos del proceso con código de error (1) si falla la conexión
    process.exit(1);
  }
};
