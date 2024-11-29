import request from 'supertest';
import { app } from '../src/server.js';
import { Cliente } from '../src/models/customers_models.js';
import { expect } from 'chai';