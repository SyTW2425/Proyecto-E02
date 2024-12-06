import { Schema, model, Document } from 'mongoose';
import validator from 'validator';

import { cardSchema } from './card.js';

/**
 * Interfaz para el modelo de usuario.
 */
export interface CardTuple {
  card: typeof cardSchema;
}

/**
 * Interfaz para el modelo de usuario.
 */
export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  cards: CardTuple[];
}

/**
 * Esquema de una tupla de carta.
 */
export const cardTupleSchema: Schema = new Schema<CardTuple>({
  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
});

export const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) =>
        validator.isLength(value, { min: 1, max: 20 }),
      message: 'Name must be between 1 and 20 characters',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isStrongPassword(value),
      message: 'Password is not strong enough',
    },
  },
  cards: {
    type: [cardTupleSchema],
  },
});

export default model<IUser>('User', userSchema);
