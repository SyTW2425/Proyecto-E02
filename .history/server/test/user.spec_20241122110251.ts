import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { User } from '../src/models/user.js';
import { expect } from 'chai';

describe('User API', () => {
  before(async () => {
    // Conectar a la base de datos antes de ejecutar las pruebas
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    // Desconectar de la base de datos después de ejecutar las pruebas
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Limpiar la colección de usuarios antes de cada prueba
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('debería crear un nuevo usuario', async () => {
      const newUser = {
        name: 'testuser',
        email: 'testuser@example.com',
        password: 'Str0ngP@ssw0rd!',
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(res.body).to.have.property('msg', 'El usuario se ha creado con éxito');
      expect(res.body).to.have.property('User');
      expect(res.body.User).to.have.property('name', newUser.name);
      expect(res.body.User).to.have.property('email', newUser.email);

      const user = await User.findOne({ email: newUser.email });
      expect(user).to.not.be.null;
      expect(user).to.have.property('name', newUser.name);
      expect(user).to.have.property('email', newUser.email);
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

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);

      expect(res.body).to.have.property('msg', 'Ya existe un usuario con ese email');
    });

    it('debería devolver un error si los datos son inválidos', async () => {
      const newUser = {
        name: '',
        email: 'invalidemail',
        password: 'weakpassword',
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);

      expect(res.body).to.have.property('errors');
    });
  });
});