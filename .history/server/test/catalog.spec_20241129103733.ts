import request from 'supertest';
import app from '../src/app.js';
import Catalog from '../src/models/catalog.js';
import Card, { IAttack, AttackModel, cardSchema } from '../src/models/card.js';
import User from '../src/models/user.js';
import { expect } from 'chai';