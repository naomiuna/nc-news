const apiRouter = require('express').Router();

const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const endpoints = require('../endpoints.json');
const {handle405s} = require('../errors')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.route('/')
  .get((req, res, next) => {
  res.status(200).send(endpoints);
  })
  .all(handle405s)
  ;

module.exports = apiRouter;
