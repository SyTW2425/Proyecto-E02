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

// Pruebas para la búsqueda de usuarios
describe('GET /users', () => {
  // Antes de cada prueba, limpiamos la base de datos y añadimos usuarios de prueba
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany([
      { name: 'user1', email: 'user1@example.com', password: 'password11234567WEDFGHN@' },
      { name: 'user2', email: 'user2@example.com', password: 'password212345678ASDCVBNJYTRDC@' },
    ]);
  });

  it('debería obtener todos los usuarios', async () => {
    const response = await request(app).get('/users').expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body).to.have.length(2);
    expect(response.body[0]).to.include({ name: 'user1', email: 'user1@example.com' });
    expect(response.body[1]).to.include({ name: 'user2', email: 'user2@example.com' });
  });

  it('debería obtener un usuario por email', async () => {
    const response = await request(app)
      .get('/users')
      .query({ email: 'user1@example.com' })
      .expect(200);

    expect(response.body).to.be.an('object');
    expect(response.body).to.include({ name: 'user1', email: 'user1@example.com' });
  });

  it('debería devolver un error si no hay usuarios en la base de datos', async () => {
    await User.deleteMany({});
    const response = await request(app).get('/users').expect(404);

    expect(response.body).to.have.property('error', 'Users not found');
  });
});

describe('GET /users/:id', () => {
  let testUser: InstanceType<typeof User>;

  // Antes de cada prueba, limpiamos la base de datos y añadimos un usuario de prueba
  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({ name: 'user1', email: 'user1@example.com', password: 'password112345678WSDFGHJ' });
    await testUser.save();
  });

  it('debería obtener un usuario por su ID', async () => {
    const response = await request(app).get(`/users/${testUser._id}`).expect(200);

    expect(response.body).to.have.property('msg', 'Usuario encontrado por id con éxito');
    expect(response.body.User).to.include({ name: 'user1', email: 'user1@example.com' });
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app).get(`/users/${nonExistentId}`).expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });

  it('debería devolver un error si el ID es inválido', async () => {
    const invalidId = '12345';

    const response = await request(app).get(`/users/${invalidId}`).expect(500);

    expect(response.body).to.have.property('msg', 'Error al buscar el usuario');
  });
});

// Pruebas para la eliminación de usuarios
describe('DELETE /users/:id', () => {
  // Antes de cada prueba, limpiamos la base de datos y creamos un usuario de prueba
  let testUser: InstanceType<typeof User>;

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({
      name: 'deleteuser',
      email: 'deleteuser@example.com',
      password: 'Str0ngP@ssw0rd!',
    });
    await testUser.save();
  });

  it('debería eliminar un usuario existente', async () => {
    const response = await request(app)
      .delete(`/users/${testUser._id}`)
      .expect(200);

    expect(response.body).to.have.property(
      'msg',
      'Usuario eliminado con éxito'
    );
    expect(response.body.User).to.have.property('email', 'deleteuser@example.com');

    // Verificamos que el usuario fue eliminado de la base de datos
    const deletedUser = await User.findById(testUser._id);
    expect(deletedUser).to.be.null;
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/users/${nonExistentId}`)
      .expect(404);

    expect(response.body).to.have.property(
      'msg',
      'Usuario no encontrado'
    );
  });

  it('debería devolver un error si el ID es inválido', async () => {
    const invalidId = '12345';

    const response = await request(app)
      .delete(`/users/${invalidId}`)
      .expect(500);

    expect(response.body).to.have.property(
      'msg',
      'Error al eliminar el usuario'
    );
  });
});