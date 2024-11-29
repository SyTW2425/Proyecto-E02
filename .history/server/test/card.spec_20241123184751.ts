import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Card, { IAttack, AttackModel, cardSchema } from '../models/card.js';
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

    // Hacemos un get a las crtas del usuario
    

    expect(response.body).to.have.property('msg', 'Cartas del usuario encontradas con éxito');
    expect(response.body).to.have.property('cards');
    expect(response.body.cards).to.be.an('array');
    expect(response.body.cards[0]).to.have.property('card');
    expect(response.body.cards[0].card).to.have.property('name', 'Pikachu');

    
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
