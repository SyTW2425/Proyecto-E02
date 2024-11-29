import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User, { userSchema, cardTupleSchema } from '../src/models/user.js';
import { expect } from 'chai';

// Pruebas para la creación de un nuevo usuario
describe('POST /users', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('debería crear un nuevo usuario', async () => {
    const newUser = {
      name: 'testuser',
      email: 'testuser@example.com',
      password: 'Str0ngP@ssw0rd!',
    };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).to.have.property(
      'msg',
      'El usuario se ha creado con éxito'
    );
    expect(response.body).to.have.property('User');
    expect(response.body.User).to.include({
      name: 'testuser',
      email: 'testuser@example.com',
    });
  });

  it('debería devolver un error si el email ya existe', async () => {
    const existingUser = new User({
      name: 'existinguser',
      email: 'existinguser@example.com',
      password: 'Str0ngP@ssw0rd!',
    });
    await existingUser.save();

    const newUser = {
      name: 'testuser',
      email: 'existinguser@example.com',
      password: 'Str0ngP@ssw0rd!',
    };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(400);

    expect(response.body).to.have.property(
      'msg',
      'Ya existe un usuario con ese email'
    );
  });

  it('debería devolver un error si los datos son inválidos', async () => {
    const newUser = {
      name: '',
      email: 'invalidemail',
      password: 'weakpassword',
    };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(400);

    expect(response.body).to.have.property('errors');
  });
});

// Pruebas para eliminar un usuario
describe('DELETE /users', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('debería eliminar un usuario', async () => {
    const existingUser = new User({
      name: 'existinguser',
      email: '