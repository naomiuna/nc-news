const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById, getArticles } = require('../controllers/articlesControllers')
const {postComment, getComments} = require('../controllers/commentsControllers')
const {handle405s} = require('../errors')

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s)

articlesRouter.route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(handle405s)

articlesRouter.route('/')
  .get(getArticles)

module.exports = articlesRouter;
