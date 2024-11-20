import express from 'express';
import { signup, signin } from '../controllers/authController.js';

export const signupRouter = express.Router();
export const signinRouter = express.Router();

// Ruta para el registro de usuarios
signupRouter.post('/signup', signup);
signinRouter.post('/signin', signin);
