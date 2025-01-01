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
 * Interfaz para el modelo de solicitud de intercambio.
 */
export interface TradeRequest {
  _id: Schema.Types.ObjectId;
  requesterUserId: Schema.Types.ObjectId;
  requesterCardId: Schema.Types.ObjectId;
  targetUserId: Schema.Types.ObjectId;
  targetCardId: Schema.Types.ObjectId;
  message: string;
}

/**
 * Interfaz para el modelo de usuario.
 */
export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  cards: CardTuple[];
  mailbox: TradeRequest[];
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

/**
 * Esquema de una solicitud de intercambio.
 */
export const tradeRequestSchema: Schema = new Schema<TradeRequest>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  requesterUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requesterCardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  targetUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetCardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  message: {
    type: String,
    default: function () {
      return `Usuario ${this.requesterUserId}, quiere intercambiar ${this.requesterCardId} esta por tu ${this.targetCardId}`;
    },
  },
});

/**
 * Esquema de un usuario.
 */
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
  mailbox: {
    type: [tradeRequestSchema],
  },
});

export default model<IUser>('User', userSchema);
