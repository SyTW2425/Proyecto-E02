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
import Catalog from './models/catalog.js';
import Card, { ICard, IAttack, AttackModel } from './models/card.js';
import { transactionRouter } from './routes/transaction_routers.js';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '4200', 10);

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
app.use(transactionRouter);
app.use('/auth', signupRouter);
app.use('/auth', signinRouter);

/**
 * Inicia el servidor Express.
 */
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is up on port ${port}`);
});

const loadDefaultCatalog = process.env.LOAD_DEFAULT_CATALOG === 'true' || false;

if (loadDefaultCatalog) {
  const defaultCatalogPath = path.join(
    __dirname,
    '../..',
    'data',
    'default_catalog.json'
  );
  const defaultCatalogData = JSON.parse(
    fs.readFileSync(defaultCatalogPath, 'utf-8')
  );

  // Guardar el catálogo por defecto en la base de datos
  const saveDefaultCatalog = async () => {
    try {
      const existingCatalog = await Catalog.findOne({
        name: defaultCatalogData.name,
      });
      if (existingCatalog) {
        await Catalog.deleteOne({ name: defaultCatalogData.name });
        console.log('Existing catalog deleted');
      }
      const catalog = new Catalog(defaultCatalogData);
      await catalog.save();
      console.log('Default catalog loaded successfully');
    } catch (error) {
      console.error('Error loading default catalog:', error);
    }
  };

  saveDefaultCatalog();
}

export default app;
