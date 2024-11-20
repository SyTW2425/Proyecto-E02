import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initCatalog } from './functions/initCatalog.js';
import { signupRouter, signinRouter } from './routes/auth_routers.js';
import { getCatalogRouter } from './routes/catalog_routers.js';
import dotenv from 'dotenv';
import './db/mongoose.js';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const port = 4200;

app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta de prueba
app.get('/', (req, res) => {
  console.log('Request to /');
  res.send('Hello, world!');
});

// Rutas de autenticación
app.use('/catalog', getCatalogRouter);
app.use('/auth', signupRouter);
app.use('/auth', signinRouter);

// Inicializa el catálogo
initCatalog()
  .then((): void => {
    console.log('Catalog initialized');
  })
  .catch((error: Error): void => {
    console.error('Error initializing catalog:', error);
  });

/**
 * Inicia el servidor Express.
 */
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is up on port ${port}`);
});
