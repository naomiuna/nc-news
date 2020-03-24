process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const connection = require('../db/connection')

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('/api', () => {
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
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        it('Status:200 - returns correct user object', () => {
          return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.eql({
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
              });
            });
        })
        it('Status:404 - with message username not found, if passed a non existent id', () => {
          return request(app)
            .get('/api/users/nonexistent_user')
            .expect(404)
            .then(({body:{msg}}) => {
            expect(msg).to.equal('username not found')
          })
        })
      })
        describe('INVALID METHODS', () => {
          it('Status:405 for an invalid method', () => {
            const methods = ['post', 'patch', 'put', 'delete'];
            const promises = methods.map(method => {
              return request(app)
                [method]('/api/users/icellusedkars')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promises);
          });
        });
    })
  })
})