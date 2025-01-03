import request from 'supertest';
import app from '../src/app.js';
import User, { IUser } from '../src/models/user.js';
import Card, {
  ICard,
  IAttack,
  AttackModel,
  cardSchema,
} from '../src/models/card.js';
import Transaction from '../src/models/transaction.js';
import { expect } from 'chai';

let user: any;
let token: string;

before(async () => {
  // Crear un usuario y obtener el token
  user = {
    name: 'testuser',
    email: 'testuser@example.com',
    password: 'Str0ngP@ssw0rd!',
  };

  await request(app).post('/auth/signup').send(user);

  const response = await request(app).post('/auth/signin').send({
    email: user.email,
    password: user.password,
  });

  token = response.body.token;
  // console.log(token);
});

describe('POST /transactions', async () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});
    await Transaction.deleteMany({});
  });

  it('debería realizar una transacción entre dos usuarios', async () => {
    // creamos test_user1
    const test_user1 = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Str0ngP@ssw0rd!',
    });
    await test_user1.save();
    // creamos test_user2
    const test_user2 = new User({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'Str0ngP@ssw0rd!2',
    });
    await test_user2.save();

    // creamos test_card1
    const test_card1 = {
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
    };
    // creamos test_card2
    const test_card2 = {
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
          name: 'Scratch',
          energies: ['Colorless'],
          damage: 10,
        },
      ],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      description:
        'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.',
      isHolographic: false,
      value: 5,
      rarity: 'Common',
    };

    // hacemos un post de la carta al usuario test_user1
    const response_p = await request(app)
      .post(`/cards/${test_user1.name}`)
      .set('Authorization', `Bearer ${token}`)
      .send(test_card1)
      .expect(201);

    if (response_p.status !== 201) {
      console.log('Error al crear la carta');
      console.log(response_p.body);
    }

    // hacemos un post de la carta al usuario test_user2
    const response_p_2 = await request(app)
      .post(`/cards/${test_user2.name}`)
      .set('Authorization', `Bearer ${token}`)
      .send(test_card2)
      .expect(201);

    if (response_p_2.status !== 201) {
      console.log('Error al crear la carta 2');
      console.log(response_p_2.body);
    }

    // Hacemos get('/users/:id/cards para verificar que las cartas se han asignado correctamente

    // console.log('response_p.body');
    // console.log(response_p.body);
    // console.log('response_p_2.body');
    // console.log(response_p_2.body);
    const id_card1 = response_p.body._id;
    const id_card2 = response_p_2.body._id;

    const user1Response = await request(app)
      .get(`/users/${test_user1._id}/cards`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // console.log('user1Response.body');
    // console.log(user1Response.body);
    // console.log('user1Response.body.cards[0].card.name');
    expect(user1Response.body.cards[0].card.name).to.equal('Ponyta');

    const user2Response = await request(app)
      .get(`/users/${test_user2._id}/cards`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(user2Response.body.cards[0].card.name).to.equal('Charmander');

    const response = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId1: test_user1._id,
        userId2: test_user2._id,
        cardId1: id_card1,
        cardId2: id_card2,
      })
      .expect(200);
    expect(response.body.msg).to.equal('Transacción realizada con éxito');
  });
});
