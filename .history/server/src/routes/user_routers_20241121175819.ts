import express, { Request, Response } from 'express';
import User from '../models/user.js';

export const userRouter = express.Router();
userRouter.use(express.json());

/**
 * Manejador para la creación de un nuevo usuario
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @returns {Response} - Objeto JSON con el usuario creado o un mensaje de error
 */
userRouter.post('/users', async (req: Request, res: Response): Promise<void> => {
    try {
      const duplicatedUser = await User.findOne({ email: req.body.email });
      if (duplicatedUser) {
        res.status(400).json({ msg: 'Ya existe un usuario con ese email' });
        return;
      }
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ msg: 'El usuario se ha creado con éxito', User: user });
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
userRouter.get('/users/:id/cards', async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate('cards.card');
    if (!user) {
      res.status(404).json({ msg: 'Usuario no encontrado' });
      return;
    }
    res.status(200).json({ msg: 'Cartas del usuario encontradas con éxito', cards: user.cards });
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar las cartas del usuario', error });
  }
});