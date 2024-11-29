import request from 'supertest';
import app from '../src/app.js';
import User, { IUser } from '../src/models/user.js';
import Card, { ICard, IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import Transaction from '../src/models/transaction.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

describe('POST /transactions', async () => {


  // creamos test_user1
  const test_user1 = new User ({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Str0ngP@ssw0rd!',
  });
  await test_user1.save();
  // creamos test_user2
  const test_user2 = new User ({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'Str0ngP@ssw0rd!2',
  });
  await test_user2.save();

  // creamos test_card1
  const test_card1 = new Card({
    name: 'Ponyta',
    nPokeDex: 77,
    type: 'Fire',
    weakness: 'Water',
    hp: 50,
    attacks: [
      {
        name: 'Ember',
        energies: ['Fire', 'Colorless'],
        damage: 30,
        effect: 'May burn the opponent.',
      },
      {
        name: 'Flame Tail',
        energies: ['Fire', 'Colorless', 'Colorless'],
        damage: 50,
      },
    ],
    retreatCost: ['Colorless'],
    phase: 'Basic',
    description:
      'Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.',
    isHolographic: false,
    value: 5,
    rarity: 'Common',
  });
  // creamos test_card2
  const test_card2 = new Card({
    name: 'Charmander',
    nPokeDex: 4,
    type: 'Fire',
    weakness: 'Water',
    hp: 50,
    attacks: [
      {
        name: 'Ember',
        energies: ['Fire', 'Colorless'],
        damage: 30,
        effect: 'May burn the opponent.',
      },
      {
        name: 'Flame Tail',
        energies: ['Fire', 'Colorless', 'Colorless'],
        damage: 50,
      },
    ],
    retreatCost: ['Colorless'],
    phase: 'Basic',
    description:
      'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.',
    isHolographic: false,
    value: 5,
    rarity: 'Common',
  });



    // hacemos un post de la carta al usuario test_user1
    const card1Response = await request(app)
      .post(`/cards/${test_user1.name}`)
      .send(test_card1)
      .expect(201);
   

    // hacemos un post de la carta al usuario test_user2
    const card2Response = await request(app)
      .post(`/cards/${test_user2.name}`)
      .send(test_card2)
      .expect(201);
   
 
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
        userId1: user1Id,
        userId2: user2Id,
        cardId1: card1Id,
        cardId2: card2Id,

        userId
      })
      .expect(200);
    expect(response.body.msg).to.equal('Transacción realizada con éxito');
  });
});