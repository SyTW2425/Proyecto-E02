import fs from 'fs';
import path from 'path';
import Catalog from '../models/catalog.js';

/** */
export const initCatalog = async () => {
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const dataPath = path.join(__dirname, '..', 'data', 'catalog.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const catalogData = JSON.parse(jsonData);

    // Verifica si el catálogo ya existe y elimínalo si es así
    const catalogExists = await Catalog.findOne({ name: catalogData.name });
    if (catalogExists) {
      await Catalog.deleteMany({ name: catalogData.name });
      console.log('Existing catalog deleted');
    }

    // Crea un nuevo catálogo y guarda las cartas
    const newCatalog = new Catalog({ name: catalogData.name, cards: [] });
    await newCatalog.save();

    for (const card of catalogData.cards) {
      newCatalog.cards.push(card);
    }

    await newCatalog.save();
    console.log('Catalog initialized with JSON data');
  } catch (error) {
    console.error('Error initializing catalog with JSON data:', error);
  }
};
