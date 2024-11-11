import { Schema, model, Document, Types } from 'mongoose';
import { Card, ICard } from './card.model';
import validator from "validator";

interface IUser extends Document {
  name: string;
  paasword: string;
  email: string;
  collection: Types.Array<Types.ObjectId>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, validate: { validator: (value: string) => validator.isLength(value, { min: 1, max: 20 }), message: 'Name must be between 1 and 20 characters' } },
    email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Invalid email",
    },
  },
  collection: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
});

export default model<IUser>("User", userSchema);