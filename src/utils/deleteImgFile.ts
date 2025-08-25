import cloudinary from "cloudinary";

/**
 * Elimina un archivo de imagen de Cloudinary basado en su URL
 * @async
 * @param {string} url - URL completa de la imagen almacenada en Cloudinary
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la eliminación en Cloudinary
 * @example
 * await deleteImgFile('https://res.cloudinary.com/cloudname/image/upload/v1234567/folder/filename.jpg');
 */
export const deleteImgFile = async (url: string): Promise<void> => {
  const array = url.split("/");
  const name = array.at(-1)?.split(".")[0];
  let public_id = `${array.at(-2)}/${name}`;
  await cloudinary.v2.uploader.destroy(public_id);
};
