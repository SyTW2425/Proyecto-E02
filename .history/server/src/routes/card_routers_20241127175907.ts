import express, { Request, Response } from 'express';
import Card, { IAttack, AttackModel, cardSchema } from '../models/card.js';
import User from '../models/user.js';

export const cardRouter = express.Router();
cardRouter.use(express.json());

/**
 * Manejador para la creación de una nueva carta
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con la carta creada o un mensaje de error
 */
cardRouter.post(
  '/cards/:name',
  async (req: Request, res: Response): Promise<void> => {
    const name = req.params.name;
    try {
      const attackIds = await Promise.all(
        req.body.attacks.map(async (attack: IAttack) => {
          const newAttack = new AttackModel(attack);
          await newAttack.save();
          return newAttack._id;
        })
      );
      const card = new Card({ ...req.body, attacks: attackIds });
      await card.save();

      const user = await User.findOne({ name });
      if (!user) {
        res.status(404).send({ error: 'User not found' });
        return;
      }

      user.cards.push({ card: card._id as typeof cardSchema });
      await user.save();

      res.status(201).send(card);
    } catch (error) {
      res.status(400).send({
        error: 'Error creating card',
        message: (error as any).message,
      });
      // console.log(error);
    }
  }
);

/**
 * Manejador para buscar una carta en la base de datos a partir del nombre
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con la carta encontrada o un mensaje de error
 */
cardRouter.get('/cards', async (req: Request, res: Response): Promise<void> => {
  if (req.query.name) {
    try {
      const card = await Card.findOne({ name: req.query.name as string });
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ error: 'Carta no encontrada' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    try {
      const cards = await Card.find();
      if (cards) {
        res.send(cards);
      } else {
        res.status(404).send({ error: 'Cartas no encontradas' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

/**
 * Manejador para buscar una carta en la base de datos a partir del ID
 */
cardRouter.get(
  '/cards/:_id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const card = await Card.findById(req.params._id);
      if (card) {
        res.send(card).status(200).json({ msg: 'Carta encontrada con éxito' });
      } else {
        res.status(404).send({ error: 'Carta no encontrada' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

/**
 * Manejador para actualizar una carta en la base de datos
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con la carta actualizada o un mensaje de error
 */
cardRouter.put('/cards/_:id', async (req: Request, res: Response) => {
 const id = req.params.id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(id,req.body, {
      new: true,
    });
    if (!updatedCard) {
      res.status(404).json({ msg: 'Carta no encontrada' });
    }
    res.status(200).json({
      msg: 'Carta actualizada con éxito',
      Card: updatedCard
    });
  } catch (error) {
    res.
});

/**
 * Manejador para eliminar todas las cartas de la base de datos.
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con un mensaje de éxito o un mensaje de error
 */
cardRouter.delete(
  '/cards',
  async (req: Request, res: Response): Promise<void> => {
    try {
      await Card.deleteMany();
      res.send({ message: 'All cards deleted' });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

/**
 * Manejador para eliminar una carta de la base de datos
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con la carta eliminada o un mensaje de error
 */
cardRouter.delete(
  '/cards/:_id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const card = await Card.findByIdAndDelete(req.params._id);
      if (card) {
        await User.updateMany(
          { 'cards.card': req.params._id },
          { $pull: { cards: { card: req.params._id } } }
        );
        const user = await User.findOne({ 'cards.card': req.params._id });
        res.send({
          message: `Carta ${card.name} eliminada del usuario ${user?.name}`,
        });
      } else {
        res.status(404).send({ error: 'Carta no encontrada' });
      }
    } catch (error) {
      res.status(500).send({error: 'Carta no encontrada'});
    }
  }
);
