import dotenv from 'dotenv';
import { connect } from 'mongoose';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

console.log(process.env.ATLAS_URI);
/**
 * Connects to the MongoDB database using the provided URL.
 *
 * @param {string} process.env.ATLAS_URI - The URL of the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} If there is an error connecting to the database.
 */
connect(process.env.ATLAS_URI!)
  .then(() => {
    console.log('Connected to the database: ', process.env.ATLAS_URI);
  })
  .catch((error) => {
    console.error(
      'Trying to connect to the database: ',
      process.env.ATLAS_URI,
      error
    );
    process.exit(-1);
  });
