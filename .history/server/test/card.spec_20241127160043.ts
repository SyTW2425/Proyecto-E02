import request from 'supertest';
import app from '../src/app.js';
import Card, { IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import User from '../src/models/user.js';
import { expect } from 'chai';

// Pruebas para la creación de una nueva carta
describe('POST /cards/:name', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});
  });

  it('debería crear una nueva carta y asociarla a un usuario existente', async () => {
    const user = new User({
      name: 'testuser',
      email: 'testuser@example.com',
      password: 'Str0ngP@ssw0rd!',
    });

    await user.save();

    const newCard = {
      "name": "Ponyta",
      "nPokeDex": 77,
      "type": "Fire",
      "weakness": "Water",
      "hp": 50,
      "attacks": [
          {
              "name": "Ember",
              "energies": ["Fire", "Colorless"],
              "damage": 30,
              "effect": "May burn the opponent."
          },
          {
              "name": "Flame Tail",
              "energies": ["Fire", "Colorless", "Colorless"],
              "damage": 50
          }
      ],
      "retreatCost": ["Colorless"],
      "phase": "Basic",
      "description": "Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.",
      "isHolographic": false,
      "value": 5,
      "rarity": "Common"
    };

    // Hacemos un post de la carta
    const response = await request(app)
      .post(`/cards/${user.name}`)
      .send(newCard)
      .expect(201);

    // ACORDARSE DE CAMBIAR ESTO
    // Hacemos un get a las cartas del usuario
    const responseGet = await request(app)
      .get(`/users/${user._id}/cards`)
      .expect(200);

    expect(responseGet.body).to.have.property(
      'msg',
      'Cartas del usuario encontradas con éxito'
    );
    expect(responseGet.body).to.have.property('cards');
    expect(responseGet.body.cards).to.be.an('array');
    expect(responseGet.body.cards[0]).to.have.property('card');
    expect(responseGet.body.cards[0].card).to.have.property('name', 'Ponyta');
  });

  it('debería devolver un error si los datos son inválidos', async () => {
    const user = new User({
      name: 'testuser',
      email: 'testuser@example.com',
      password: 'Str0ngP@ssw0rd!',
    });
    await user.save();

    const newCard = {
      name: '',
      nPokeDex: -1,
      type: 'InvalidType',
      weakness: 'InvalidWeakness',
      hp: -10,
      attacks: [],
      retreatCost: ['InvalidCost'],
      phase: 'InvalidPhase',
      isHolographic: false,
      value: -10,
      rarity: 'InvalidRarity',
    };

    const response = await request(app)
      .post(`/cards/${user.name}`)
      .send(newCard)
      .expect(400);

    expect(response.body).to.have.property('error', 'Error creating card');
  });
  it('debería devolver un error si el usuario no existe', async () => {
    const newCard = {
      name: 'Ponyta',
      nPokeDex: 77,
      type: 'Fire',
      weakness: 'Water',
      hp: 50,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 5,
      rarity: 'Common',
    };

    const response = await request(app)
      .post('/cards/invaliduser')
      .send(newCard)
      .expect(404);

    expect(response.body).to.have.property('error', 'User not found');
  });
});

describe('GET /cards', () => {
  it('debería devolver todas las cartas existentes', async () => {
    const card1 = new Card({
      name: 'Card1',
      nPokeDex: 1,
      type: 'Fire',
      weakness: 'Water',
      hp: 50,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 5,
      rarity: 'Common',
    });
    const card2 = new Card({ 
      name: 'Card2',
      nPokeDex: 2,
      type: 'Water',
      weakness: 'Fire',
      hp: 50,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 5,
      rarity: 'Common',

    });
    await card1.save();
    await card2.save();

    const response = await request(app).get('/cards').expect(200);
    expect(response.body).to.be.an('array').with.lengthOf(2);
  });

  it('debería devolver un error 404 si no hay cartas', async () => {
    await Card.deleteMany();
    const response = await request(app).get('/cards').expect(404);
    expect(response.body).to.have.property('error', 'Cartas no encontradas');
  });
});
