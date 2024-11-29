import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Card, { IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import User from '../src/models/user.js';
import { expect } from 'chai';

describe('POST /cards/:name', () => {
  let testUser: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});
    testUser = new User({
      name: 'TestUser',
      email: 'testuser@example.com',
      password: 'StrongPassword123!',
      cards: [],
    });
    await testUser.save();
  });

  it('should create a new card and add it to the user\'s card tuple', async () => {
    const attack = new AttackModel({
      name: 'Thunder Shock',
      energies: ['Lightning'],
      damage: 30,
    });
    await attack.save();

    const cardData = {
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Lightning',
      weakness: 'Ground',
      hp: 60,
      attacks: [attack._id],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 100,
      rarity: 'Common',
    };

    const res = await request(app)
      .post(`/cards/${cardData.name}`)
      .send(cardData)
      .expect(201);

    expect(res.body).to.have.property('_id');
    expect(res.body.name).to.equal(cardData.name);

    const updatedUser = await User.findById(testUser._id).populate('cards.card');
    expect(updatedUser.cards).to.have.lengthOf(1);
    expect(updatedUser.cards[0].card.name).to.equal(cardData.name);
  });

  it('should return an error if the card data is invalid', async () => {
    const invalidCardData = {
      name: '',
      nPokeDex: -1,
      type: 'InvalidType',
      weakness: 'InvalidWeakness',
      hp: -10,
      attacks: [],
      retreatCost: ['InvalidCost'],
      phase: 'InvalidPhase',
      isHolographic: false,
      value: -100,
      rarity: 'InvalidRarity',
    };

    const res = await request(app)
      .post(`/cards/${invalidCardData.name}`)
      .send(invalidCardData)
      .expect(400);

    expect(res.body).to.have.property('message');
  });

  it('should return an error if the user does not exist', async () => {
    await User.deleteMany({});

    const cardData = {
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Lightning',
      weakness: 'Ground',
      hp: 60,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 100,
      rarity: 'Common',
    };

    const res = await request(app)
      .post(`/cards/${cardData.name}`)
      .send(cardData)
      .expect(404);

    expect(res.body).to.have.property('message');
  });
});
