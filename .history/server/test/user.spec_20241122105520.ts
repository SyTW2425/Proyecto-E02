import request from 'supertest';
import { app } from '../src/app.js';
import { User } from '../src/models/user.js';
import { expect } from 'chai';