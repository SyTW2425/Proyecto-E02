import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Card from '../src/models/card.js';
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
    };

    const response = await request(app)
      .post(`/cards/${user.name}`)
      .send(newCard)
      .expect(201);

    expect(response.body).to.have.property('name', 'Pikachu');
    expect(response.body).to.have.property('nPokeDex', 25);

    const updatedUser = await User.findById(user._id).populate('cards.card');
    expect(updatedUser).to.not.be.null;
    if (updatedUser) {
      expect(updatedUser.cards).to.have.length(1);
    }
    if (updatedUser && updatedUser.cards.length > 0) {
      expect(updatedUser.cards[0].card).to.have.property('name', 'Pikachu');
    }
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const newCard = {
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Electric',
      weakness: 'Ground',
      hp: 60,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 10,
      rarity: 'Common',
    };

    const response = await request(app)
      .post('/cards/nonexistentuser')
      .send(newCard)
      .expect(404);

    expect(response.body).to.have.property('error', 'User not found');
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

// Pruebas para la obtención de cartas
describe('GET /cards', () => {
  // Antes de cada prueba, limpiamos la base de datos y añadimos cartas de prueba
  beforeEach(async () => {
    await Card.deleteMany({});
    await Card.insertMany([
      {
        name: 'Pikachu',
        nPokeDex: 25,
        type: 'Electric',
        weakness: 'Ground',
        hp: 60,
        attacks: [],
        retreatCost: ['Colorless'],
        phase: 'Basic',
        isHolographic: false,
        value: 10,
        rarity: 'Common',
      },
      {
        name: 'Charizard',
        nPokeDex: 6,
        type: 'Fire',
        weakness: 'Water',
        hp: 120,
        attacks: [],
        retreatCost: ['Colorless', 'Colorless'],
        phase: 'Stage 2',
        isHolographic: true,
        value: 100,
        rarity: 'Ultra Rare',
      },
    ]);
  });

  it('debería obtener todas las cartas', async () => {
    const response = await request(app).get('/cards').expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body).to.have.length(2);
    expect(response.body[0]).to.include({ name: 'Pikachu', nPokeDex: 25 });
    expect(response.body[1]).to.include({ name: 'Charizard', nPokeDex: 6 });
  });

  it('debería obtener una carta por su ID', async () => {
    const card = await Card.findOne({ name: 'Pikachu' });

    if (!card) {
      throw new Error('Card not found');
    }
    const response = await request(app).get(`/cards/${card._id}`).expect(200);

    expect(response.body).to.have.property('msg', 'Carta encontrada con éxito');
    expect(response.body.Card).to.include({ name: 'Pikachu', nPokeDex: 25 });
  });

  it('debería devolver un error si la carta no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app).get(`/cards/${nonExistentId}`).expect(404);

    expect(response.body).to.have.property('msg', 'Carta no encontrada');
  });
});

// Pruebas para la actualización de una carta
describe('PUT /cards/:id', () => {
  // Antes de cada prueba, limpiamos la base de datos y añadimos una carta de prueba
  let testCard: InstanceType<typeof Card>;

  beforeEach(async () => {
    await Card.deleteMany({});
    testCard = new Card({
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Electric',
      weakness: 'Ground',
      hp: 60,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 10,
      rarity: 'Common',
    });
    await testCard.save();
  });

  it('debería actualizar una carta existente', async () => {
    const updatedData = {
      name: 'Raichu',
      nPokeDex: 26,
      type: 'Electric',
      weakness: 'Ground',
      hp: 80,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Stage 1',
      isHolographic: true,
      value: 20,
      rarity: 'Uncommon',
    };

    const response = await request(app)
      .put(`/cards/${testCard._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).to.have.property('msg', 'Se ha actualizado correctamente la carta');
    expect(response.body).to.have.property('Card');
    expect(response.body.Card).to.include({
      name: 'Raichu',
      nPokeDex: 26,
      type: 'Electric',
      weakness: 'Ground',
      hp: 80,
      isHolographic: true,
      value: 20,
      rarity: 'Uncommon',
    });

    const updatedCard = await Card.findById(testCard._id);
    expect(updatedCard).to.not.be.null;
    expect(updatedCard).to.have.property('name', 'Raichu');
    expect(updatedCard).to.have.property('nPokeDex', 26);
  });

  it('debería devolver un error si la carta no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = {
      name: 'Raichu',
      nPokeDex: 26,
      type: 'Electric',
      weakness: 'Ground',
      hp: 80,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Stage 1',
      isHolographic: true,
      value: 20,
      rarity: 'Uncommon',
    };

    const response = await request(app)
      .put(`/cards/${nonExistentId}`)
      .send(updatedData)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Carta no encontrada');
  });

  it('debería devolver un error si los datos son inválidos', async () => {
    const updatedData = {
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
      .put(`/cards/${testCard._id}`)
      .send(updatedData)
      .expect(500);

    expect(response.body).to.have.property('msg', 'Error al actualizar la carta');
  });
});

// Pruebas para la eliminación de una carta
describe('DELETE /cards/:id', () => {
  // Antes de cada prueba, limpiamos la base de datos y añadimos una carta de prueba
  let testCard: InstanceType<typeof Card>;

  beforeEach(async () => {
    await Card.deleteMany({});
    testCard = new Card({
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Electric',
      weakness: 'Ground',
      hp: 60,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 10,
      rarity: 'Common',
    });
    await testCard.save();
  });

  it('debería eliminar una carta existente', async () => {
    const response = await request(app)
      .delete(`/cards/${testCard._id}`)
      .expect(200);

    expect(response.body).to.have.property('msg', 'Carta eliminada con éxito');
    expect(response.body).to.have.property('Card');
    expect(response.body.Card).to.include({
      name: 'Pikachu',
      nPokeDex: 25,
    });

    const deletedCard = await Card.findById(testCard._id);
    expect(deletedCard).to.be.null;
  });

  it('debería devolver un error si la carta no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/cards/${nonExistentId}`)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Carta no encontrada');
  });

  it('debería devolver un error si el ID es inválido', async () => {
    const invalidId = '12345';

    const response = await request(app)
      .delete(`/cards/${invalidId}`)
      .expect(500);

    expect(response.body).to.have.property('msg', 'Error al eliminar la carta');
  });
});