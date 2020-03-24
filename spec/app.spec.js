process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const connection = require('../db/connection')


describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it('returns status code 404 for all incorrect paths', () => {
    return request(app)
      .get('/invalid_path')
      .expect(404)
      .then(result => {
        expect(result.body).to.eql({ msg: 'path not found' });
      });
  });
  describe('/topics', () => {

  })
})