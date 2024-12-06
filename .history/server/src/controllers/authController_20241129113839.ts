import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Controlador para el registro de usuarios (Sign Up)
export const signup: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  // Verificamos si los datos están completos
  if (!name || !email || !password) {
    res.status(400).send('Name, email, and password are required');
    return;
  }

  // Verificamos si el usuario ya está registrado
  const existing = await User.findOne({ name });
  if (existing) {
    res.status(400).send('User is already registered');
    return;
  }

  // Verificamos si el email ya está registrado
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).send('Email is already registered');
    return;
  }

  // Encriptamos la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creamos un nuevo usuario
  const newUser = new User({ name, email, password: hashedPassword });

  // Guardamos el usuario en la base de datos
  await newUser.save();

  res.status(201).send('User created');
};

export const signin: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required');
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send('Invalid credentials');
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).send('Invalid credentials');
    return;
  }

  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token });
};