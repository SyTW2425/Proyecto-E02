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

  it('debería realizar una transacción entre dos usuarios', async () => {
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
      "name": "Venonat",
      "nPokeDex": 48,
      "type": ["Grass", "Darkness"],
      "hp": 50,
      "attacks": [
          {
          "name": "Tackle",
          "energies": ["Colorless"],
          "damage": 20
          },
          {
          "name": "Poison Powder",
          "energies": ["Grass", "Colorless"],
          "damage": 20,
          "effect": "May poison the opponent."
          }
      ],
      "retreatCost": ["Colorless"],
      "phase": "Basic",
      "description": "Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.",
      "isHolographic": false,
      "value": 5,
      "rarity": "Common"
  });
  // creamos test_card2
  const test_card2 = new Card({
    
  });



    // hacemos un post de la carta al usuario test_user1
    await request(app)
      .post(`/cards/${test_user1.name}`)
      .send(test_card1)
      .expect(201);
   

    // hacemos un post de la carta al usuario test_user2
    await request(app)
      .post(`/cards/${test_user2.name}`)
      .send(test_card2)
      .expect(201);
   
 
  // Hacemos get('/users/:id/cards para verificar que las cartas se han asignado correctamente
  
    const user1Response = await request(app)
      .get(`/users/${test_user1._id}/cards`)
      .expect(200);
    expect(user1Response.body.cards[0].name).to.equal("Ponyta");

    const user2Response = await request(app)
      .get(`/users/${test_user2._id}/cards`)
      .expect(200);
    expect(user2Response.body.cards[0].name).to.equal("Charmander");
  

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