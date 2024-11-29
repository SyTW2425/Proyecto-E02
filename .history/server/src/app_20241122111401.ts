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

const defaultCatalogPath = path.join(__dirname, 'data', 'default_catalog.json');

console.log('Default catalog path:', defaultCatalogPath);

const data = fs.readFileSync(defaultCatalogPath, 'utf8');
const initializeDefaultCatalog = async () => {
  try {
    const defaultCatalog = JSON.parse(data);
    const { name, cards } = defaultCatalog;

    // Check if the catalog with the same name exists
    const existingCatalog = await Catalog.findOne({ name });
    if (existingCatalog) {
      // Delete the existing catalog
      await Catalog.findByIdAndDelete(existingCatalog._id);
    }

    // Create the new catalog
    const cardIds = await Promise.all(
      cards.map(async (cardData: ICard) => {
        const attackIds = await Promise.all(
          cardData.attacks.map(async (attack: IAttack) => {
            const newAttack = new AttackModel({
              name: attack.name,
              energies: attack.energies,
              damage: attack.damage,
              effect: attack.effect,
            });
            await newAttack.save();
            return newAttack._id;
          })
        );

        const card = new Card({
          ...cardData,
          attacks: attackIds,
        });
        await card.save();
        return card._id;
      })
    );

    const catalog = new Catalog({ name, cards: cardIds });
    await catalog.save();

    console.log('Default catalog initialized');
  } catch (error) {
    console.error('Error initializing default catalog:', error);
  }
};

initializeDefaultCatalog();

export default app;
