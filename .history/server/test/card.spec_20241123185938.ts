import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Card, { IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import User from '../src/models/user.js';
import { expect } from 'chai';


describe('POST /cards/:name', () => {
  beforeEach(async () => {
    await Card.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new card', async () => {
    const newCard = {
      name: 'testcard',
      attacks: [
        { name: 'attack1', damage: 10 },
        { name: 'attack2', damage: 20 },
      ],
    };

    const response = await request(app)
      .post('/cards/testuser')
      .send(newCard)
      .expect(201);

    expect(response.body).to.have.property('name', 'testcard');
    expect(response.body).to.have.property('attacks');
    expect(response.body.attacks).to.have.length(2);
    expect(response.body.attacks[0]).to.have.property('name', 'attack1');
    expect(response.body.attacks[0]).to.have.property('damage', 10);
    expect(response.body.attacks[1]).to.have.property('name', 'attack2');
    expect(response.body.attacks[1]).to.have.property('damage', 20);

    const user = await User.findOne({ name: 'testuser' });
    expect(user).to.have.property('cards');
    expect(user.cards).to.have.length(1);
    expect(user.cards[0].card).to.equal(response.body._id);
  });

  it('should return an error if the user does not exist', async () => {
    const newCard = {
      name: 'testcard',
      attacks: [
        { name: 'attack1', damage: 10 },
        { name: 'attack2', damage: 20 },
      ],
    };

    const response = await request(app)
      .post('/cards/nonexistentuser')
      .send(newCard)
      .expect(404);

    expect(response.body).to.have.property('error', 'User not found');
  });

  it('should return an error if the card cannot be created', async () => {
    const newCard = {
      name: 'testcard',
      attacks: [
        { name: 'attack1', damage: 10 },
        { name: 'attack2', damage: 20 },
      ],
    };

    const response = await request(app)
      .post('/cards/testuser')
      .send(newCard)
      .expect(400);

    expect(response.body).to.have.property