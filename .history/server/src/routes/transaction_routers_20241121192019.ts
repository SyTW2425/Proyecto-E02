import express, { Request, Response } from 'express';
import User from '../models/user.js';
import Card from '../models/card.js';
import 
export const transactionRouter = express.Router();
transactionRouter.use(express.json());

/**
 * Manejador para realizar una transacción (intercambio de cartas) entre dos usuarios
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el resultado de la transacción o un mensaje de error
 */
transactionRouter.post(
  '/transactions',
  async (req: Request, res: Response): Promise<void> => {
    const { userId1, userId2, cardId1, cardId2 } = req.body;

    try {
      // Buscar los usuarios por sus IDs
      const user1 = await User.findById(userId1);
      const user2 = await User.findById(userId2);

      if (!user1 || !user2) {
        res
          .status(404)
          .json({ msg: 'Uno o ambos usuarios no fueron encontrados' });
        return;
      }

      // Buscar las cartas por sus IDs
      const card1 = user1.cards.find(
        (cardTuple) => cardTuple.card.toString() === cardId1
      );
      const card2 = user2.cards.find(
        (cardTuple) => cardTuple.card.toString() === cardId2
      );

      if (!card1 || !card2) {
        res
          .status(404)
          .json({
            msg: 'Una o ambas cartas no fueron encontradas en los usuarios',
          });
        return;
      }

      // Realizar el intercambio de cartas
      user1.cards = user1.cards.filter(
        (cardTuple) => cardTuple.card.toString() !== cardId1
      );
      user2.cards = user2.cards.filter(
        (cardTuple) => cardTuple.card.toString() !== cardId2
      );

      user1.cards.push({ card: card2.card });
      user2.cards.push({ card: card1.card });

      // Guardar los cambios en la base de datos
      await user1.save();
      await user2.save();

      res.status(200).json({ msg: 'Transacción realizada con éxito' });
    } catch (error) {
      res.status(500).json({ msg: 'Error al realizar la transacción', error });
    }
  }
);
