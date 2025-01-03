import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Card from '../src/models/card.js';
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
      {
        name: 'user1',
        email: 'user1@example.com',
        password: 'Str0ngP@ssw0rd!123',
      },
      {
        name: 'user2',
        email: 'user2@example.com',
        password: 'Str0ngP@ssw0rd!123',
      },
    ]);
  });

  it('debería obtener todos los usuarios', async () => {
    const response = await request(app).get('/users').expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body).to.have.length(2);
    expect(response.body[0]).to.include({
      name: 'user1',
      email: 'user1@example.com',
    });
    expect(response.body[1]).to.include({
      name: 'user2',
      email: 'user2@example.com',
    });
  });

  it('debería obtener un usuario por email', async () => {
    const response = await request(app)
      .get('/users')
      .query({ email: 'user1@example.com' })
      .expect(200);

    expect(response.body).to.be.an('object');
    expect(response.body).to.include({
      name: 'user1',
      email: 'user1@example.com',
    });
  });
});

describe('GET /users/:id', () => {
  let testUser: InstanceType<typeof User>;

  // Antes de cada prueba, limpiamos la base de datos y añadimos un usuario de prueba
  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
    });
    await testUser.save();
  });

  it('debería obtener un usuario por su ID', async () => {
    const response = await request(app)
      .get(`/users/${testUser._id}`)
      .expect(200);

    expect(response.body).to.have.property(
      'msg',
      'Usuario encontrado por id con éxito'
    );
    expect(response.body.User).to.include({
      name: 'user1',
      email: 'user1@example.com',
    });
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/users/${nonExistentId}`)
      .expect(404);

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
    expect(response.body.User).to.have.property(
      'email',
      'deleteuser@example.com'
    );

    // Verificamos que el usuario fue eliminado de la base de datos
    const deletedUser = await User.findById(testUser._id);
    expect(deletedUser).to.be.null;
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/users/${nonExistentId}`)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
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

// Pruebas para la actualización de un usuario
describe('PUT /users/:id', () => {
  // Antes de cada prueba, limpiamos la base de datos y añadimos un usuario de prueba
  let testUser: InstanceType<typeof User>;

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
    });
    await testUser.save();
  });

  it('debería actualizar un usuario existente', async () => {
    const updatedData = {
      name: 'updatedUser',
      email: 'updateduser@example.com',
      password: 'An0th3r$tr0ngP@ss!',
    };

    const response = await request(app)
      .put(`/users/${testUser._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).to.have.property(
      'msg',
      'Se ha actualizado correctamente el usuario'
    );
    expect(response.body).to.have.property('User');
    expect(response.body.User).to.include({
      name: 'updatedUser',
      email: 'updateduser@example.com',
    });
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser).to.not.be.null;
    expect(updatedUser).to.have.property('name', 'updatedUser');
    expect(updatedUser).to.have.property('email', 'updateduser@example.com');
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = {
      name: 'updatedUser',
      email: 'updateduser@example.com',
      password: 'An0th3r$tr0ngP@ss!',
    };

    const response = await request(app)
      .put(`/users/${nonExistentId}`)
      .send(updatedData)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });
});

// Pruebas para la obtención de cartas de un usuario
describe('GET /users/:id/cards', () => {
  let testUser: InstanceType<typeof User>;
  let testCard: InstanceType<typeof Card>;

  beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});

    testCard = new Card({
      name: 'Pikachu',
      nPokeDex: 25,
      type: 'Lightning',
      weakness: 'Fighting',
      hp: 60,
      attacks: [],
      retreatCost: ['Colorless'],
      phase: 'Basic',
      isHolographic: false,
      value: 10,
      rarity: 'Common',
    });
    await testCard.save();

    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
      cards: [{ card: testCard._id, quantity: 1 }],
    });
    await testUser.save();
  });

  it('debería obtener las cartas de un usuario existente', async () => {
    const response = await request(app)
      .get(`/users/${testUser._id}/cards`)
      .expect(200);

    expect(response.body).to.have.property(
      'msg',
      'Cartas del usuario encontradas con éxito'
    );
    expect(response.body).to.have.property('cards');
    expect(response.body.cards).to.be.an('array');
    expect(response.body.cards[0]).to.have.property('card');
    expect(response.body.cards[0].card).to.have.property('name', 'Pikachu');
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/users/${nonExistentId}/cards`)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });
});
// Pruebas para agregar una nueva solicitud de intercambio al buzón de un usuario
describe('POST /users/:id/mailbox', () => {
  let testUser: InstanceType<typeof User>;

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
    });
    await testUser.save();
  });

  it('debería agregar una nueva solicitud de intercambio', async () => {
    const tradeRequest = {
      requesterUserId: new mongoose.Types.ObjectId(),
      requesterCardId: new mongoose.Types.ObjectId(),
      targetUserId: new mongoose.Types.ObjectId(),
      targetCardId: new mongoose.Types.ObjectId(),
      message: 'Intercambio de prueba',
    };

    const response = await request(app)
      .post(`/users/${testUser._id}/mailbox`)
      .send(tradeRequest)
      .expect(201);

    expect(response.body).to.have.property(
      'msg',
      'Solicitud de intercambio agregada'
    );
    expect(response.body).to.have.property('mailbox');
    expect(response.body.mailbox).to.be.an('array');
    expect(response.body.mailbox[0]).to.include({
      message: 'Intercambio de prueba',
    });
    expect(response.body.mailbox[0].requesterUserId).to.equal(
      tradeRequest.requesterUserId.toString()
    );
    expect(response.body.mailbox[0].requesterCardId).to.equal(
      tradeRequest.requesterCardId.toString()
    );
    expect(response.body.mailbox[0].targetUserId).to.equal(
      tradeRequest.targetUserId.toString()
    );
    expect(response.body.mailbox[0].targetCardId).to.equal(
      tradeRequest.targetCardId.toString()
    );
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const tradeRequest = {
      requesterUserId: new mongoose.Types.ObjectId(),
      requesterCardId: new mongoose.Types.ObjectId(),
      targetUserId: new mongoose.Types.ObjectId(),
      targetCardId: new mongoose.Types.ObjectId(),
      message: 'Intercambio de prueba',
    };

    const response = await request(app)
      .post(`/users/${nonExistentId}/mailbox`)
      .send(tradeRequest)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });
});

// Pruebas para obtener todas las solicitudes de intercambio del buzón de un usuario
describe('GET /users/:id/mailbox', () => {
  let testUser: InstanceType<typeof User>;

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
      mailbox: [
        {
          requesterUserId: new mongoose.Types.ObjectId(),
          requesterCardId: new mongoose.Types.ObjectId(),
          targetUserId: new mongoose.Types.ObjectId(),
          targetCardId: new mongoose.Types.ObjectId(),
          message: 'Intercambio de prueba',
        },
      ],
    });
    await testUser.save();
  });

  it('debería obtener todas las solicitudes de intercambio del buzón de un usuario', async () => {
    const response = await request(app)
      .get(`/users/${testUser._id}/mailbox`)
      .expect(200);

    expect(response.body).to.have.property('mailbox');
    expect(response.body.mailbox).to.be.an('array');
    expect(response.body.mailbox[0]).to.include({
      message: 'Intercambio de prueba',
    });
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/users/${nonExistentId}/mailbox`)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });
});

// Pruebas para actualizar una solicitud de intercambio en el buzón de un usuario
describe('PUT /users/:id/mailbox/:requestId', () => {
  let testUser: InstanceType<typeof User>;
  let tradeRequestId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    await User.deleteMany({});
    tradeRequestId = new mongoose.Types.ObjectId();
    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
      mailbox: [
        {
          _id: tradeRequestId,
          requesterUserId: new mongoose.Types.ObjectId(),
          requesterCardId: new mongoose.Types.ObjectId(),
          targetUserId: new mongoose.Types.ObjectId(),
          targetCardId: new mongoose.Types.ObjectId(),
          message: 'Intercambio de prueba',
        },
      ],
    });
    await testUser.save();
  });

  it('debería actualizar una solicitud de intercambio existente', async () => {
    const updatedRequest = {
      message: 'Mensaje actualizado',
    };

    const response = await request(app)
      .put(`/users/${testUser._id}/mailbox/${tradeRequestId}`)
      .send(updatedRequest)
      .expect(200);

    expect(response.body).to.have.property(
      'msg',
      'Solicitud de intercambio actualizada'
    );
    expect(response.body).to.have.property('mailbox');
    expect(response.body.mailbox[0]).to.include(updatedRequest);
  });

  it('debería devolver un error si la solicitud de intercambio no existe', async () => {
    const nonExistentRequestId = new mongoose.Types.ObjectId();
    const updatedRequest = {
      message: 'Mensaje actualizado',
    };

    const response = await request(app)
      .put(`/users/${testUser._id}/mailbox/${nonExistentRequestId}`)
      .send(updatedRequest)
      .expect(404);

    expect(response.body).to.have.property(
      'msg',
      'Solicitud de intercambio no encontrada'
    );
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedRequest = {
      message: 'Mensaje actualizado',
    };

    const response = await request(app)
      .put(`/users/${nonExistentId}/mailbox/${tradeRequestId}`)
      .send(updatedRequest)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });
});

// Pruebas para eliminar una solicitud de intercambio del buzón de un usuario
describe('DELETE /users/:id/mailbox/:requestId', () => {
  let testUser: InstanceType<typeof User>;
  let tradeRequestId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    await User.deleteMany({});
    tradeRequestId = new mongoose.Types.ObjectId();
    testUser = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: 'Str0ngP@ssw0rd!123',
      mailbox: [
        {
          _id: tradeRequestId,
          requesterUserId: new mongoose.Types.ObjectId(),
          requesterCardId: new mongoose.Types.ObjectId(),
          targetUserId: new mongoose.Types.ObjectId(),
          targetCardId: new mongoose.Types.ObjectId(),
          message: 'Intercambio de prueba',
        },
      ],
    });
    await testUser.save();
  });

  it('debería eliminar una solicitud de intercambio existente', async () => {
    const response = await request(app)
      .delete(`/users/${testUser._id}/mailbox/${tradeRequestId}`)
      .expect(200);

    expect(response.body).to.have.property(
      'msg',
      'Solicitud de intercambio eliminada'
    );
    expect(response.body).to.have.property('mailbox');
    expect(response.body.mailbox).to.be.an('array').that.is.empty;
  });

  it('debería devolver un error si la solicitud de intercambio no existe', async () => {
    const nonExistentRequestId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/users/${testUser._id}/mailbox/${nonExistentRequestId}`)
      .expect(404);

    expect(response.body).to.have.property(
      'msg',
      'Solicitud de intercambio no encontrada'
    );
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/users/${nonExistentId}/mailbox/${tradeRequestId}`)
      .expect(404);

    expect(response.body).to.have.property('msg', 'Usuario no encontrado');
  });
});
