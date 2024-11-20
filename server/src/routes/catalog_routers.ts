import express from 'express';
import { getCatalog } from '../controllers/catalogController.js';

export const getCatalogRouter = express.Router();

// Ruta para obtener el catálogo
getCatalogRouter.get('/', getCatalog);
