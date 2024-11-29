import express, { Request, Response } from 'express';
import cors from 'cors';
import { signupRouter, signinRouter } from './routes/auth_routers.js';
import { catalogRouter } from './routes/catalog_routers.js';
import { userRouter } from './routes/user_routers.js';
import dotenv from 'dotenv';
import './db/mongoose.js';
import { cardRouter } from './routes/card_routers.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4200;

app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  console.log('Request to /');
  res.send('Hello, world!');
});

// Rutas de autenticación
app.use(catalogRouter);
app.use(cardRouter);
app.use(userRouter);
app.use('/auth', signupRouter);
app.use('/auth', signinRouter);

/**
 * Inicia el servidor Express.
 */
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is up on port ${port}`);
});

const defaultCatalogPath = path.join(
  __dirname,
  '../../src/data/default_catalog.json'
);

fs.readFile(defaultCatalogPath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading default catalog file:', err);
    return;
  }

  try {
    const defaultCatalog = JSON.parse(data);
    console.log('Default catalog parsed');
    // Check if the catalog with the same name exists
    console.log('http://localhost:', port, '/catalogs?name=DefaultCatalog');
    const checkResponse = await fetch(
      `http://localhost:${port}/catalogs?name=DefaultCatalog`,
      {
        method: 'GET',
      }
    );
    console.log('Checking existing catalog');
    if (checkResponse.ok) {
      const catalog = await checkResponse.json();
      if (catalog) {
        // Delete the existing catalog
        const deleteResponse = await fetch(
          `http://localhost:${port}/catalogs/${catalog._id}`,
          {
            method: 'DELETE',
          }
        );

        if (!deleteResponse.ok) {
          console.error(
            'Error deleting existing catalog:',
            await deleteResponse.json()
          );
          return;
        }
      }
    } else {
      console.error(
        'Error checking existing catalog:',
        await checkResponse.json()
      );
      return;
    }

    console.log('Default catalog deleted');

    // Create the new catalog
    const createResponse = await fetch(`http://localhost:${port}/catalogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultCatalog),
    });

    if (createResponse.ok) {
      console.log('Default catalog initialized');
    } else {
      console.error(
        'Error initializing default catalog:',
        await createResponse.json()
      );
    }
  } catch (error) {
    console.error('Error parsing default catalog file:', error);
  }
});
