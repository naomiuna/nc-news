process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const connection = require('../db/connection')

after(() => connection.destroy());

describe('/api', () => {
  //test for 404 - all incorrect paths
  describe('/topics', () => {
    
  })
})