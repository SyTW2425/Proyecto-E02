import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import { cardSchema, ICard } from './card.js';

export interface ICatalog extends Document {
  name: string;
  cards: ICard[];
}

const catalogSchema: Schema = new Schema<ICatalog>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => value.length > 0 && value.length <= 20,
      message: 'Name must be between 1 and 20 characters',
    },
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
  ],
});

export default model<ICatalog>('Catalog', catalogSchema);
