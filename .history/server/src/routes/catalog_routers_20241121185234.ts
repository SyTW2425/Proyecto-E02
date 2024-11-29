import express, { Request, Response } from 'express';
import Catalog from '../models/catalog.js';
import Card, { ICard, IAttack, AttackModel } from '../models/card.js';

export const catalogRouter = express.Router();
catalogRouter.use(express.json());

/**
 * Manejador para la creación de un nuevo catálogo
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el catálogo creado o un mensaje de error
 */
catalogRouter.post(
  '/catalogs',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, cards } = req.body;
      const duplicatedCatalog = await Catalog.findOne({ name: req.body.name });
      if (duplicatedCatalog) {
        res.status(400).json({ msg: 'Ya existe un catálogo con ese nombre' });
        return;
      }

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

      res
        .status(201)
        .json({ msg: 'El catálogo se ha creado con éxito', Catalog: catalog });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

/**
 * Manejador para buscar un catálogo en la base de datos a partir del nombre
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el catálogo encontrado o un mensaje de error
 */
catalogRouter.get(
  '/catalogs/:name?',
  async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    try {
      if (name) {
        const catalog = await Catalog.findOne({ name });
        if (catalog) {
          res.send(catalog);
        } else {
          res.status(404).send({ error: 'Catalog not found' });
        }
      } else {
        const catalogs = await Catalog.find();
        res.send(catalogs);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

/**
 * Manejador para actualizar un catálogo en la base de datos
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 */
catalogRouter.patch(
  '/catalogs',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, cards } = req.body;
      const catalog = await Catalog.findOne({ name });
      if (!catalog) {
        res.status(404).json({ msg: 'Catalog not found' });
        return;
      }

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

      catalog.cards = cardIds;
      await catalog.save();

      res.json({
        msg: 'El catálogo se ha actualizado con éxito',
        Catalog: catalog,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

/**
 * Manejador para eliminar un catálogo de la base de datos
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 */
catalogRouter.delete(
  '/catalogs/:name',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const catalog = await Catalog.findOneAndDelete({ name: req.params.name });
      if (catalog) {
        res.send('Catalog deleted');
      } else {
        res.status(404).send({ error: 'Catalog not found' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// Crear manejador que nos permita hacer busquedas filtradas de cartas, como query params, :name, :type, :value, :rarity
/**
 * Manejador para buscar cartas en la base de datos con filtros
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con las cartas encontradas o un mensaje de error
 */
catalogRouter.get(
  '/catalogs/search',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, type, value, rarity } = req.query;

      // Construir el filtro de búsqueda
      const filter: any = {};
      if (name) filter.name = { $regex: name, $options: 'i' }; // Búsqueda insensible a mayúsculas
      if (type) filter.type = type;
      if (value) filter.value = value;
      if (rarity) filter.rarity = rarity;

      // Buscar las cartas en la base de datos
      const cards = await Card.find(filter);
      if (cards.length === 0) {
        res
          .status(404)
          .json({
            msg: 'No se encontraron cartas con los filtros proporcionados',
          });
      }

      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ msg: 'Error al buscar las cartas', error });
    }
  }
);

/**
 * Manejador para visualizar todas las cartas de un catálogo específico
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con las cartas del catálogo o un mensaje de error
 */
catalogRouter.get(
  '/catalogs/:catalogId/cards',
  async (req: Request, res: Response): Promise<void> => {
    const { catalogId } = req.params;

    try {
      // Buscar el catálogo por su ID
      const catalog = await Catalog.findById(catalogId).populate('cards');
      if (!catalog) {
        res.status(404).json({ msg: 'Catálogo no encontrado' });
      } else {
        // Devolver las cartas del catálogo
        res.status(200).json(catalog.cards);
      }
    } catch (error) {
      res
        .status(500)
        .json({ msg: 'Error al buscar las cartas del catálogo', error });
    }
  }
);
