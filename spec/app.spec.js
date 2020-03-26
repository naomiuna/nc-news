process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const { expect } = chai;
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
  describe('GET', () => {
    it('Status:200 - respnds with endpoints JSON', () => {
      return request(app)
        .get('/api')
      .expect(200)
    })
  })
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
  describe('/articles', () => {
    describe('/:article_id', () => {
      describe('GET', () => {
        it('Status:200 - returns article object with required keys', () => {
          return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({body:{article}}) => {
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes',
              'comment_count')
          })
        })
        it('Status:200 - returns article object with correct values', () => {
          return request(app)
            .get('/api/articles/5')
            .expect(200)
            .then(({body:{article}}) => {
              expect(article).to.eql({
                article_id: 5,
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                created_at: '2002-11-19T12:21:54.171Z',
                votes: 0,
                comment_count: '2'
              });
          })
        })  
        it('Status:404 - with message article not found if passed valid but non-existent id', () => {
          return request(app)
            .get('/api/articles/47')
            .expect(404)
            .then(({body:{msg}}) => {
              expect(msg).to.equal('article not found');
          })
        })
        it('Status:400 - with message bad request if passed an invalid id', () => {
          return request(app)
            .get('/api/articles/not_an_ID')
            .expect(400)
            .then(({body:{msg}}) => {
            expect(msg).to.equal('bad request')
          })
        })
      })
      describe('PATCH', () => {
        it('Status:200 - updates and returns article for given id - positive numbers', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({body:{article}}) => {
              expect(article.votes).to.equal(105);
          })
        })
        it('Status:200 - updates and returns article for given id - negative numbers', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({body:{article}}) => {
              expect(article.votes).to.equal(95);
          })
        })
        it('Status:404 - message article not found for valid but non-existent article_id', () => {
          return request(app)
            .patch('/api/articles/99')
            .send({ inc_votes: -5 })
            .expect(404)
            .then(({body:{msg}}) => {
            expect(msg).to.equal('article not found')
          })
        })
        it('Status:400 - with message bad request if passed an invalid id', () => {
          return request(app)
            .patch('/api/articles/not_an_ID')
            .send({inc_votes: -5})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('Status:400 -  with message bad request if no inc_votes property on body', () => {
          return request(app)
            .patch('/api/articles/9')
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        })
        it('Status:400 -  with message bad request if invalid inc_votes property on body', () => {
          return request(app)
            .patch('/api/articles/9')
            .send({ inc_votes: 'cat'})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        })
        it('Status:400 -  with message bad request if passed additional properties on body', () => {
          return request(app)
            .patch('/api/articles/9')
            .send({ inc_votes: 5, name:'naomi'})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        })
      })
      describe('INVALID METHODS', () => {
        it('Status:405 for an invalid method', () => {
          const methods = ['post', 'put', 'delete'];
          const promises = methods.map(method => {
            return request(app)
              [method]('/api/articles/1')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(promises);
        });
      });
      describe('/comments', () => {
        describe('POST', () => {
          it('Status:201 - creates and returns new comment with correct keys', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'rogersop',
                body: 'a comment'
              })
              .expect(201)
              .then(({body:{comment}}) => {
                expect(comment).to.have.keys(
                  'comment_id',
                  'body',
                  'article_id',
                  'author',
                  'votes',
                  'created_at'
                );
              });
          })
          it('Status:201 - creates and returns new comment with correct values', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'rogersop',
                body: 'a comment'
              })
              .expect(201)
              .then(({body:{comment}}) => {
                expect(comment.author, comment.body).to.equal(
                  'rogersop',
                  'a comment'
                );
              });
          })
          it('Status:422 - message unprocessable entity for valid but non-existent article_id', () => {
            return request(app)
              .post('/api/articles/99/comments')
              .send({
                username: 'rogersop',
                body: 'a comment'
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessable entity');
              });
          });
          it('Status:400 - with message bad request if passed an invalid id', () => {
            return request(app)
              .post('/api/articles/not_an_ID/comments')
              .send({
                username: 'rogersop',
                body: 'a comment'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('Status:400 -  with message bad request if no body', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('Status:400 -  with message bad request if incomplete body', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 'rogersop' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('Status:422 -  with message unprocessable entity if passed non existent username', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 123, body: 'a comment' })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessable entity');
              });
          });
          it('Status:400 -  with message bad request if passed additional properties on body', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'rogersop',
                body: 'a comment',
                extraKey: 'not allowed'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        })
        describe('GET', () => {
          it('Status:200 - responds with an array of comments', () => {
            return request(app)
              .get('/api/articles/9/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.have.lengthOf(2);
              });
          });
          it('Status:200 - comment objects contain correct keys', () => {
            return request(app)
              .get('/api/articles/9/comments')
              .expect(200)
              .then(({body:{comments}}) => {
                comments.forEach(comment => {
                expect(comment).to.have.keys(
                  'comment_id',
                  'votes',
                  'created_at',
                  'author',
                  'body'
                );
              })
            })
          })
          it('Status:200 - Default sort criteria is created_at and order descending', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({body:{comments}}) => {
              expect(comments).to.be.descendingBy('created_at')
            })
          })
          it('Status:200 - sorts by given column if given a query', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=votes')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy('votes');
              });
          });
          it('Status:200 - sorts by ascending order if added as query', () => {
            return request(app)
              .get('/api/articles/1/comments?order=asc')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.ascendingBy('created_at');
              });
          });
          it('Status:200 - returns an empty array for valid article with no comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.have.lengthOf(0);
              });
          })
          it('Status:400 with message bad request when passed invalid sort_by query', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=bananas')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('Status:400 with message bad request when passed invalid order query', () => {
            return request(app)
              .get('/api/articles/1/comments?order=bananas')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('Status:400 - with message bad request if passed an invalid id', () => {
            return request(app)
              .get('/api/articles/not_an_ID/comments')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('Status:404 - message article not found for valid but non-existent article_id', () => {
            return request(app)
              .get('/api/articles/99/comments')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article not found');
              });
          })
        })
        describe('INVALID METHODS', () => {
          it('Status:405 for an invalid method', () => {
            const methods = ['patch', 'put', 'delete'];
            const promises = methods.map(method => {
              return request(app)
              [method]('/api/articles/1/comments')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promises);
          });
        });
      });
    })
    describe('GET', () => {
      it('Status:200 - returns an array of articles', () => {
        
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an('array')
          expect(articles).to.have.lengthOf(12)
        })
      })
      it('Status:200 - articles in result array contain right keys', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'topic',
                'created_at',
                'votes'
              );
            });
          });
      });
      it('Status:200 - Default sort criteria is created_at and order descending', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('created_at');
          });
      });
      it('Status:200 - articles have comment_count property with correct value', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles :[article] } }) => {
            expect(article.comment_count).to.equal('13');
          });
      });
      it('Status:200 - sorts by given column if given a query', () => {
        return request(app)
          .get('/api/articles?sort_by=title')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('title');
          });
      });
      it('Status:200 - sorts by ascending order if added as query', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy('created_at');
          });
      });
      it('Status:200: returns only relevant articles if passed an author query', () => {
        return request(app)
          .get('/api/articles?author=icellusedkars')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles).to.have.lengthOf(6);
            articles.forEach(article => {
              expect(article.author).to.equal('icellusedkars');
            });
          });
      });
      it('Status:200: returns an empty array of articles if passed a valid author with no articles', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles).to.have.lengthOf(0);
          });
      });
      it('Status:200: returns only relevant articles if passed a topic query', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.lengthOf(11);
            articles.forEach(article => {
              expect(article.topic).to.equal('mitch');
            });
          });
      });
      it('Status:200: returns an empty array of articles if passed a valid topic with no articles', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles).to.have.lengthOf(0);
          });
      });
      it('Status:400 when passed invalid sort_by query', () => {
        return request(app)
          .get('/api/articles?order=bananas')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('bad request');
          });
      });
      it('Status:400 when passed invalid order query', () => {
        return request(app)
          .get('/api/articles?sort_by=bananas')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('bad request');
          });
      });
      it('Status:404 when passed a non existent author', () => {
        return request(app)
          .get('/api/articles?author=naomi')
          .expect(404)
          .then(({body:{msg}}) => {
          expect(msg).to.equal('username not found');
        })
      })
      it('Status:404 when passed a non existent topic', () => {
        return request(app)
          .get('/api/articles?topic=dogs')
          .expect(404)
          .then(({body:{msg}}) => {
          expect(msg).to.equal('topic not found');
        })
      })
    })
    describe('INVALID METHODS', () => {
      it('Status:405 for an invalid method', () => {
        const methods = ['patch', 'put', 'delete', 'post'];
        const promises = methods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('method not allowed');
            });
        });
        return Promise.all(promises);
      });
    });
  })
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('Status:200 - updates and returns article for given id - positive numbers', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(21);
            });
        });
        it('Status:200 - updates and returns article for given id - negative numbers', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(11);
            });
        });
        it('Status:404 - message comment not found for valid but non-existent comment_id', () => {
          return request(app)
            .patch('/api/comments/99')
            .send({ inc_votes: -5 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('comment not found');
            });
        });
        it('Status:400 - with message bad request if passed an invalid id', () => {
          return request(app)
            .patch('/api/comments/not_an_ID')
            .send({ inc_votes: -5 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('Status:400 -  with message bad request if no inc_votes property on body', () => {
          return request(app)
            .patch('/api/comments/2')
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('Status:400 -  with message bad request if invalid inc_votes property on body', () => {
          return request(app)
            .patch('/api/comments/2')
            .send({ inc_votes: 'cat' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('Status:400 -  with message bad request if passed additional properties on body', () => {
          return request(app)
            .patch('/api/comments/2')
            .send({ inc_votes: 5, name: 'naomi' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
      })
      describe('DELETE', () => {
        it('Status:204 - no content on successful deletion', () => {
          return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then(() => {
              return request(app)
              .get('/api/articles/9/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                expect(comments).to.have.lengthOf(1);
              });
          })
        })
        it('Status:404 - with message comment not found for valid but non existent comment_id', ()=> {
          return request(app)
            .delete('/api/comments/99')
            .expect(404)
            .then(({body:{msg}}) => {
            expect(msg).to.equal('comment not found')
          })
        })
        it('Status:404 - with message bad request for invalid comment_id', ()=> {
          return request(app)
            .delete('/api/comments/invalid_ID')
            .expect(400)
            .then(({body:{msg}}) => {
            expect(msg).to.equal('bad request')
          })
        })
      })
      describe('INVALID METHODS', () => {
        it('Status:405 for an invalid method', () => {
          const methods = ['post', 'put', 'get'];
          const promises = methods.map(method => {
            return request(app)
              [method]('/api/comments/:comment_id')
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
  describe('INVALID METHODS', () => {
    it('Status:405 for an invalid method', () => {
      const methods = ['post', 'put', 'patch', 'delete'];
      const promises = methods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(promises);
    });
  });
})