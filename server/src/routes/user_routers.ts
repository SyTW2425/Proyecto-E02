import express, { Request, Response } from 'express';
import User, { TradeRequest } from '../models/user.js';
import mongoose from 'mongoose';

export const userRouter = express.Router();
userRouter.use(express.json());

/**
 * Manejador para la creación de un nuevo usuario
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el usuario creado o un mensaje de error
 */
userRouter.post(
  '/users',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const duplicatedUser = await User.findOne({ email: req.body.email });
      if (duplicatedUser) {
        res.status(400).json({ msg: 'Ya existe un usuario con ese email' });
        return;
      }
      const user = new User(req.body);
      await user.save();
      res
        .status(201)
        .json({ msg: 'El usuario se ha creado con éxito', User: user });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

/**
 * Manejador para buscar un usuario en la base de datos a partir del email
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el usuario encontrado o un mensaje de error
 */
userRouter.get('/users', async (req: Request, res: Response): Promise<void> => {
  if (req.query.email) {
    try {
      const user = await User.findOne({ email: req.query.email });
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    try {
      const users = await User.find();
      if (users) {
        res.send(users);
      } else {
        res.status(404).send({ error: 'Users not found' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

/**
 * Manejador para buscar usuarios por nombre
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con los usuarios encontrados o un mensaje de error
 */
userRouter.get(
  '/users/search',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.query;
      const users = await User.find({ name: new RegExp(name as string, 'i') });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error searching users', error });
    }
  }
);

/**
 * Manejador para buscar un usuario por su identificador único
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el usuario encontrado o un mensaje de error
 */
userRouter.get(
  '/users/:id',
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      res
        .status(200)
        .json({ msg: 'Usuario encontrado por id con éxito', User: user });
    } catch (error) {
      res.status(500).json({ msg: 'Error al buscar el usuario', error });
    }
  }
);

/**
 * Manejador para actualizar un usuario por su identificador único
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el usuario actualizado o un mensaje de error
 */
userRouter.put(
  '/users/:id',
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
      res.status(200).json({
        msg: 'Se ha actualizado correctamente el usuario',
        User: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ msg: 'Error al actualizar el usuario', error });
    }
  }
);

/**
 * Manejador para eliminar un usuario por su identificador único
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el usuario eliminado o un mensaje de error
 */
userRouter.delete(
  '/users/:id',
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
      }
      res
        .status(200)
        .json({ msg: 'Usuario eliminado con éxito', User: deletedUser });
    } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar el usuario', error });
    }
  }
);

/**
 * Manejador para obtener las cartas de un usuario por su identificador único
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con las cartas del usuario o un mensaje de error
 */
userRouter.get(
  '/users/:id/cards',
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const user = await User.findById(id).populate('cards.card');
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({
        msg: 'Cartas del usuario encontradas con éxito',
        cards: user.cards,
      });
    } catch (error) {
      res
        .status(500)
        .json({ msg: 'Error al buscar las cartas del usuario', error });
    }
  }
);

/**
 * Ruta para agregar una nueva solicitud de intercambio al buzón de un usuario.
 */
userRouter.post(
  '/users/:id/mailbox',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      const tradeRequest = {
        ...req.body,
        requesterUserId: new mongoose.Types.ObjectId(req.body.requesterUserId),
        requesterCardId: new mongoose.Types.ObjectId(req.body.requesterCardId),
        targetUserId: new mongoose.Types.ObjectId(req.body.targetUserId),
        targetCardId: new mongoose.Types.ObjectId(req.body.targetCardId),
      };
      user.mailbox.push(tradeRequest);
      await user.save();
      res.status(201).json({
        msg: 'Solicitud de intercambio agregada',
        mailbox: user.mailbox,
      });
    } catch (error) {
      res
        .status(500)
        .json({ msg: 'Error al agregar la solicitud de intercambio', error });
    }
  }
);

/**
 * Ruta para obtener todas las solicitudes de intercambio del buzón de un usuario.
 */
userRouter.get(
  '/users/:id/mailbox',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ mailbox: user.mailbox });
    } catch (error) {
      res.status(500).json({
        msg: 'Error al obtener las solicitudes de intercambio',
        error,
      });
    }
  }
);

/**
 * Ruta para actualizar una solicitud de intercambio en el buzón de un usuario.
 */
userRouter.put(
  '/users/:id/mailbox/:requestId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      const requestIndex = user.mailbox.findIndex(
        (request) => request._id.toString() === req.params.requestId
      );
      if (requestIndex === -1) {
        res.status(404).json({ msg: 'Solicitud de intercambio no encontrada' });
        return;
      }
      user.mailbox[requestIndex] = {
        ...user.mailbox[requestIndex],
        ...req.body,
        requesterUserId: new mongoose.Types.ObjectId(req.body.requesterUserId),
        requesterCardId: new mongoose.Types.ObjectId(req.body.requesterCardId),
        targetUserId: new mongoose.Types.ObjectId(req.body.targetUserId),
        targetCardId: new mongoose.Types.ObjectId(req.body.targetCardId),
      };
      await user.save();
      res.status(200).json({
        msg: 'Solicitud de intercambio actualizada',
        mailbox: user.mailbox,
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error al actualizar la solicitud de intercambio',
        error,
      });
    }
  }
);

/**
 * Ruta para eliminar una solicitud de intercambio del buzón de un usuario.
 */
userRouter.delete(
  '/users/:id/mailbox/:requestId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      const requestIndex = user.mailbox.findIndex(
        (request) => request._id.toString() === req.params.requestId
      );
      if (requestIndex === -1) {
        res.status(404).json({ msg: 'Solicitud de intercambio no encontrada' });
        return;
      }
      user.mailbox.splice(requestIndex, 1);
      await user.save();
      res.status(200).json({
        msg: 'Solicitud de intercambio eliminada',
        mailbox: user.mailbox,
      });
    } catch (error) {
      res
        .status(500)
        .json({ msg: 'Error al eliminar la solicitud de intercambio', error });
    }
  }
);

/**
 * Ruta para aceptar una solicitud de intercambio.
 */
userRouter.post(
  '/users/:id/mailbox/:requestId/accept',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      const requestIndex = user.mailbox.findIndex(
        (request) => request._id.toString() === req.params.requestId
      );
      if (requestIndex === -1) {
        res.status(404).json({ msg: 'Solicitud de intercambio no encontrada' });
        return;
      }
      const tradeRequest = user.mailbox[requestIndex];
      const requesterUser = await User.findById(tradeRequest.requesterUserId);
      if (!requesterUser) {
        res.status(404).json({ msg: 'Usuario solicitante no encontrado' });
        return;
      }

      // Realizar el intercambio de cartas
      const requesterCardIndex = requesterUser.cards.findIndex(
        (cardTuple) => cardTuple.card.toString() === tradeRequest.requesterCardId.toString()
      );
      const targetCardIndex = user.cards.findIndex(
        (cardTuple) => cardTuple.card.toString() === tradeRequest.targetCardId.toString()
      );

      if (requesterCardIndex === -1 || targetCardIndex === -1) {
        res.status(404).json({ msg: 'Una o ambas cartas no fueron encontradas' });
        return;
      }

      const [requesterCard] = requesterUser.cards.splice(requesterCardIndex, 1);
      const [targetCard] = user.cards.splice(targetCardIndex, 1);

      requesterUser.cards.push(targetCard);
      user.cards.push(requesterCard);

      // Guardar los cambios en la base de datos
      await requesterUser.save();
      await user.save();

      // Eliminar la solicitud de intercambio
      user.mailbox.splice(requestIndex, 1);
      await user.save();

      res.status(200).json({ msg: 'Intercambio aceptado y realizado con éxito' });
    } catch (error) {
      res.status(500).json({ msg: 'Error al aceptar la solicitud de intercambio', error });
    }
  }
);

/**
 * Ruta para rechazar una solicitud de intercambio.
 */
userRouter.post(
  '/users/:id/mailbox/:requestId/reject',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return;
      }
      const requestIndex = user.mailbox.findIndex(
        (request) => request._id.toString() === req.params.requestId
      );
      if (requestIndex === -1) {
        res.status(404).json({ msg: 'Solicitud de intercambio no encontrada' });
        return;
      }

      // Eliminar la solicitud de intercambio
      user.mailbox.splice(requestIndex, 1);
      await user.save();

      res.status(200).json({ msg: 'Solicitud de intercambio rechazada y eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ msg: 'Error al rechazar la solicitud de intercambio', error });
    }
  }
);
