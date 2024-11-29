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
  
  
   
 
  // Hacemos get('/users/:id/cards para verificar que las cartas se han asignado correctamente
  it('debería asignar las cartas a los usuarios', async () => {
    const user1Response = await request(app)
      .get(`/users/${test_user1._id}/cards`)
      .expect(200);
    expect(user1Response.body.cards[0].name).to.equal("Ponyta");

    const user2Response = await request(app)
      .get(`/users/${test_user2._id}/cards`)
      .expect(200);
    expect(user2Response.body.cards[0].name).to.equal("Charmander");
  });

  it('debería realizar una transacción entre dos usuarios', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        userId1: test_user1._id,
        userId2: test_user2._id,
        cardId1: test_card1._id,
        cardId2: test_card2._id,
      })
      .expect(200);
    expect(response.body.msg).to.equal('Transacción realizada con éxito');
  });
});