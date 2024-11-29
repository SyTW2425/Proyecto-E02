import { Schema, model, Document } from 'mongoose';
import validator from 'validator';

import User, { userSchema, cardTupleSchema } from './user.js';

export interface ITransaction extends Document {
  user_1: typeof userSchema;
  user_2: typeof userSchema;
  user_cards_1: (typeof cardTupleSchema)[];
  user_cards_2: (typeof cardTupleSchema)[];
  date: Date;
}

export const transactionSchema: Schema = new Schema<ITransaction>({
  user_1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_cards_1: [
    {
      type: cardTupleSchema,
      required: true,
      validate: {
        validator: (v: any[]) => v.length > 0,
        message: 'User 1 cards must have at least one object',
      },
    },
  ],
  user_cards_2: [
    {
      type: cardTupleSchema,
      required: true,
      validate: {
        validator: (v: any[]) => v.length > 0,
        message: 'User 2 must have at least one object',
      },
    },
  ],
  date: { type: Date, required: true, default: Date.now },
});

export default model<ITransaction>('Transaction', transactionSchema);
