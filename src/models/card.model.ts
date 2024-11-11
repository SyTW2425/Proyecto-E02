import { Schema, model, Document } from 'mongoose';
import validator from "validator";

enum TCGEnergy {
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
    Colorless = 'Colorless'
}

enum Phase {
    Basic = 'basic',
    Stage1 = 'stage 1',
    Stage2 = 'stage 2',
    EX = 'EX',
}

interface IAttack {
    energies: TCGEnergy[];
    damage: number;
    effect?: string;
}

interface ICard extends Document {
    name: string;
    type: TCGEnergy;
    hp: number;
    attacks: IAttack[];
    retreatCost: TCGEnergy[];
    phase: Phase;
    description?: string;
    isHolographic: boolean;
}

const attackSchema = new Schema<IAttack>({
    energies: { type: [String], required: true, enum: Object.values(TCGEnergy) },
    damage: { type: Number, required: true, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    effect: { type: String, validate: { validator: validator.isLength, arguments: { max: 500 }, message: 'Effect description is too long' } }
});

const cardSchema = new Schema<ICard>({
    name: { type: String, required: true, validate: { validator: (value: string) => validator.isLength(value, { min: 1, max: 20 }), message: 'Name must be between 1 and 20 characters' } },
    type: { type: String, required: true, enum: Object.values(TCGEnergy) },
    hp: { type: Number, required: true, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    attacks: { 
        type: [attackSchema], 
        required: true, 
        validate: { 
            validator: (attacks: IAttack[]) => attacks.length <= 3, 
            message: 'A card can have at most 3 attacks' 
        } 
    },
    retreatCost: { type: [String], required: true, enum: Object.values(TCGEnergy) },
    phase: { type: String, required: true, enum: Object.values(Phase) },
    description: { type: String, validate: { validator: validator.isLength, arguments: { max: 1000 }, message: 'Description is too long' } },
    isHolographic: { type: Boolean, required: true }
});

const Card = model<ICard>('Card', cardSchema);

export { Card, ICard, TCGEnergy, Phase };
