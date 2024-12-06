import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Card, { IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import User from '../src/models/user.js';
import { expect } from 'chai';

describe('POST /cards/:name', () => {
  let testUser: any;
