import request from 'supertest';
import { app } from '../src/server.js';
import { User } from '../src/models/user.js';
import { expect } from 'chai';