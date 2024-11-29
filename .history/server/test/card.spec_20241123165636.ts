import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import Card from '../src/models/card.js';
import { expect } from 'chai';

before(async () => {
  // Conectar a la base de datos antes de ejecutar las pruebas
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  // Desconectar de la base de datos después de ejecutar las pruebas
  await mongoose.disconnect();
});

// Pruebas para la creación de una nueva carta
describe('POST /api/cards', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Card.deleteMany({});
  });

  it('debería crear una nueva carta', async () => {
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
      .post('/api/cards')
      .send(newCard)
      .expect(201);

    expect(response.body).to.have.property('msg', 'La carta se ha creado con éxito');
    expect(response.body).to.have.property('Card');
    expect(response.body.Card).to.include({
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Electric',
      weakness: 'Ground',
      hp: 60,
      isHolographic: false,
      value: 10,
      rarity: 'Common',
    });
  });

  it('debería devolver un error si los datos son inválidos', async () => {
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
      .post('/api/cards')
      .send(newCard)
      .expect(400);

    expect(response.body).to.have.property('msg', 'Error al crear la carta');
  });
});

// Pruebas para la obtención de cartas
describe('GET /api/cards', () => {
  // Antes de cada prueba, limpiamos la base de datos y añadimos cartas de prueba
  beforeEach(async () => {
    await Card.deleteMany({});
    await Card.insertMany([
      {
        name: '