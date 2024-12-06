import { Schema, model, Document } from 'mongoose';
import validator from 'validator';

/**
 * Tipos de energía de las cartas del TCG
 */
export enum TCGEnergy {
  Grass = 'Grass',
  Fire = 'Fire',
  Water = 'Water',
  Lightning = 'Lightning',
  Psychic = 'Psychic',
  Fighting = 'Fighting',
  Darkness = 'Darkness',
  Metal = 'Metal',
  Fairy = 'Fairy',
  Dragon = 'Dragon',
  Colorless = 'Colorless',
}

/**
 * Fases de evolución de las cartas del TCG
 */
export enum Phase {
  Basic = 'Basic',
  Stage1 = 'Stage 1',
  Stage2 = 'Stage 2',
  EX = 'EX',
}

/**
 * Rareza de las cartas del TCG
 */
export enum Rarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  UltraRare = 'Ultra Rare',
}

/**
 * Interfaz de un ataque de una carta del TCG
 */
export interface IAttack {
  name: string;
  energies: TCGEnergy[];
  damage: number;
  effect?: string;
}

/**
 * Interfaz de una carta del TCG
 */
export interface ICard extends Document {
  name: string;
  nPokeDex: number;
  type: TCGEnergy;
  weakness: TCGEnergy;
  hp: number;
  attacks: IAttack[];
  retreatCost: TCGEnergy[];
  phase: Phase;
  description?: string;
  isHolographic: boolean;
  value: number;
  rarity: {
    type: String;
    required: true;
    enum: Rarity;
  };
}

/**
 * Esquema de un ataque de una carta del TCG
 */
export const attackSchema: Schema = new Schema<IAttack>({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) =>
        validator.isLength(value, { min: 1, max: 50 }),
      message: 'Name must be between 1 and 50 characters',
    },
  },
  energies: { type: [String], required: true, enum: Object.values(TCGEnergy) },
  damage: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  effect: {
    type: String,
    validate: {
      validator: validator.isLength,
      arguments: { max: 500 },
      message: 'Effect description is too long',
    },
  },
});

export const AttackModel = model<IAttack>('Attack', attackSchema);

/**
 * Esquema de una carta del TCG
 */
export const cardSchema: Schema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) =>
        validator.isLength(value, { min: 1, max: 20 }),
      message: 'Name must be between 1 and 20 characters',
    },
  },
  nPokeDex: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => Number.isInteger(value) && value > 0,
      message: '{VALUE} is not a valid number of PokeDex',
    },
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(TCGEnergy),
  },
  weakness: {
    type: String,
    required: true,
    enum: Object.values(TCGEnergy),
  },
  hp: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => Number.isInteger(value) && value > 0,
      message: '{VALUE} is not a valid quantity of HP',
    },
  },
  attacks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Attack',
      required: true,
    },
  ],
  retreatCost: {
    type: [String],
    required: true,
    enum: Object.values(TCGEnergy),
  },
  phase: {
    type: String,
    required: true,
    enum: Object.values(Phase),
  },
  description: {
    type: String,
    validate: {
      validator: validator.isLength,
      arguments: { max: 1000 },
      message: 'Description is too long',
    },
  },
  isHolographic: {
    type: Boolean,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => Number.isInteger(value) && value >= 0,
      message: '{VALUE} is not a valid value',
    },
  },
  rarity: {
    type: String,
    required: true,
    enum: Object.values(Rarity),
  },
});

export default model<ICard>('Card', cardSchema);
