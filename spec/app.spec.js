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
    describe('GET', () => {
      it('Status:200 - respnds with an array of topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an('array')
            expect(topics).to.have.lengthOf(3)
        })
      })
      it('Status:200 - topics in result array contain correct keys', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach(topic => {
              expect(topic).to.contain.keys('description', 'slug')
            })
          
        })
      })
    })
    describe('INVALID METHODS', () => {
      it('Status:405 for an invalid method', () => {
        
        const methods = ['post', 'patch', 'put', 'delete'];
        const promises = methods.map(method => {
          return request(app)
          [method]('/api/topics')
            .expect(405)
            .then(({body:{msg}}) => {
            expect(msg).to.equal('method not allowed')
          })
        })
        return Promise.all(promises)
      })
    })
  })
})