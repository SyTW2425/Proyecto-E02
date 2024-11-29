import request from 'supertest';
import app from '../src/app.js';
import Catalog from '../src/models/catalog.js';
import Card, { IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import User from '../src/models/user.js';
import { expect } from 'chai';

let token: string;
let user: any;

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

describe('Catalog Routes', () => {
  beforeEach(async () => {
    await Catalog.deleteMany({});
    await Card.deleteMany({});
  });

  describe('POST /catalogs', () => {
    it('debería crear un nuevo catálogo', async () => {
      const newCard = {
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

      const response = await request(app)
        .post('/catalogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Catalog',
          cards: [newCard],
        })
        .expect(201);

      expect(response.body).to.have.property(
        'msg',
        'El catálogo se ha creado con éxito'
      );
      expect(response.body).to.have.property('Catalog');
      expect(response.body.Catalog).to.have.property('name', 'Test Catalog');
    });

    it('debería devolver un error si el catálogo ya existe', async () => {
      const catalog = new Catalog({ name: 'Test Catalog', cards: [] });
      await catalog.save();

      const response = await request(app)
        .post('/catalogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Catalog', cards: [] })
        .expect(400);

      expect(response.body).to.have.property(
        'msg',
        'Ya existe un catálogo con ese nombre'
      );
    });
  });

  describe('GET /catalogs/:name', () => {
    it('debería devolver un catálogo existente por nombre', async () => {
      const catalog = new Catalog({ name: 'Test Catalog', cards: [] });
      await catalog.save();

      const response = await request(app)
        .get('/catalogs/Test Catalog')
        .expect(200);

      expect(response.body).to.have.property('name', 'Test Catalog');
    });

    it('debería devolver un error si el catálogo no existe', async () => {
      const response = await request(app)
        .get('/catalogs/NonExistentCatalog')
        .expect(404);

      expect(response.body).to.have.property('error', 'Catalog not found');
    });
  });

  describe('PATCH /catalogs', () => {
    it('debería actualizar un catálogo existente', async () => {
      const catalog = new Catalog({ name: 'Test Catalog', cards: [] });
      await catalog.save();

      const newCard = {
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

      const response = await request(app)
        .patch('/catalogs')
        .send({
          name: 'Test Catalog',
          cards: [newCard],
        })
        .expect(200);

      expect(response.body).to.have.property(
        'msg',
        'El catálogo se ha actualizado con éxito'
      );
      expect(response.body).to.have.property('Catalog');
      expect(response.body.Catalog).to.have.property('name', 'Test Catalog');
    });

    it('debería devolver un error si el catálogo no existe', async () => {
      const response = await request(app)
        .patch('/catalogs')
        .send({ name: 'NonExistentCatalog', cards: [] })
        .expect(404);

      expect(response.body).to.have.property('msg', 'Catalog not found');
    });
  });

  describe('DELETE /catalogs/:name', () => {
    it('debería eliminar un catálogo existente', async () => {
      const catalog = new Catalog({ name: 'Test Catalog', cards: [] });
      await catalog.save();

      const response = await request(app)
        .delete('/catalogs/Test Catalog')
        .expect(200);

      expect(response.text).to.equal('Catalog deleted');
    });

    it('debería devolver un error si el catálogo no existe', async () => {
      const response = await request(app)
        .delete('/catalogs/NonExistentCatalog')
        .expect(404);

      expect(response.body).to.have.property('error', 'Catalog not found');
    });
  });

  describe('GET /catalogs/search/:catalogName', () => {
    it('debería buscar cartas en un catálogo con filtros', async () => {
      const newCard = new Card({
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
      });
      await newCard.save();

      const catalog = new Catalog({
        name: 'Test Catalog',
        cards: [newCard._id],
      });
      await catalog.save();

      const response = await request(app)
        .get('/catalogs/search/Test Catalog')
        .query({ name: 'Ponyta' })
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('name', 'Ponyta');
    });

    it('debería devolver un error si no se encuentran cartas con los filtros proporcionados', async () => {
      const catalog = new Catalog({ name: 'Test Catalog', cards: [] });
      await catalog.save();

      const response = await request(app)
        .get('/catalogs/search/Test Catalog')
        .query({ name: 'NonExistentCard' })
        .expect(404);

      expect(response.body).to.have.property(
        'msg',
        'No se encontraron cartas con los filtros proporcionados'
      );
    });
  });

  describe('GET /catalogs/cards/:catalogName', () => {
    it('debería devolver todas las cartas de un catálogo específico por nombre', async () => {
      const newCard = new Card({
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
      });
      await newCard.save();

      const catalog = new Catalog({
        name: 'Test Catalog',
        cards: [newCard._id],
      });
      await catalog.save();

      const response = await request(app)
        .get('/catalogs/cards/Test Catalog')
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('name', 'Ponyta');
    });

    it('debería devolver un error si el catálogo no existe', async () => {
      const response = await request(app)
        .get('/catalogs/cards/NonExistentCatalog')
        .expect(404);

      expect(response.body).to.have.property('msg', 'Catálogo no encontrado');
    });
  });
});
