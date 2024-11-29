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
      name: 'Venonat',
      nPokeDex: 48,
      type: 'Grass',
      weakness: 'Fire',
      hp: 50,
      attacks: [
        {
          name: 'Tackle',
          energies: ['Colorless'],
          damage: 20,
        },
        {
          name: 'Poison Powder',
          energies: ['Grass', 'Colorless'],
          damage: 20,
          effect: 'May poison the opponent.',
        },
      ],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      description:
        'Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.',
      isHolographic: false,
      value: 5,
      rarity: 'Common',
    };

    // Hacemos un post de la carta
    const response = await request(app)
      .post(`/cards/${user.name}`)
      .send(newCard)
      .expect(201);

    // ACORDARSE DE CAMBIAR ESTO
    // Hacemos un get a las cartas del usuario
    const responseGet = await request(app)
      .get(`/cards/${user.name}`)
      .expect(200);

    expect(responseGet.body).to.have.property(
      'msg',
      'Cartas del usuario encontradas con éxito'
    );
    expect(responseGet.body).to.have.property('cards');
    expect(responseGet.body.cards).to.be.an('array');
    expect(responseGet.body.cards[0]).to.have.property('card');
    expect(responseGet.body.cards[0].card).to.have.property('name', 'Venonat');
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
});
