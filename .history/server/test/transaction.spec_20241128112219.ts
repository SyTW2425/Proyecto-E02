import request from 'supertest';
import app from '../src/app.js';
import User, { IUser } from '../src/models/user.js';
import Card, { ICard, IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import Transaction from '../src/models/transaction.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

describe('POST /transactions', async () => {

  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});
    await Transaction.deleteMany({});
  });
  it
});