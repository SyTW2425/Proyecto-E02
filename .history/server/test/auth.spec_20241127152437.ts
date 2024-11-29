import request from 'supertest';
import app from '../src/app.js';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import { expect } from 'chai';

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Str0ngP@ssw0rd!',
      });

      expect(res.status).to.equal(201);
      expect(res.text).to.equal('User created');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).to.not.be.null;
      expect(user?.name).to.equal('Test User');
    });

    it('should not create a user with an existing email', async () => {
      await new User({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Str0ngP@ssw0rd!',
      }).save();

      const res = await request(app).post('/auth/signup').send({
        name: 'New User',
        email: 'existing@example.com',
        password: 'Str0ngP@ssw0rd!',
      });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal('Email is already registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/auth/signup').send({
        name: 'Test User',
      });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal('Name, email, and password are required');
    });
  });

  describe('POST /auth/signin', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      }).save();
    });

    it('should sign in an existing user', async () => {
      const res = await request(app).post('/auth/signin').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should return 400 for invalid credentials', async () => {
      const res = await request(app).post('/auth/signin').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal('Invalid credentials');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/auth/signin').send({
        email: 'test@example.com',
      });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal('Email and password are required');
    });
  });
});
