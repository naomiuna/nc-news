const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById } = require('../controllers/articlesControllers')
const {postComment} = require('../controllers/commentsControllers')
const {handle405s} = require('../errors')

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s)

articlesRouter.route('/:article_id/comments')
.post(postComment)

module.exports = articlesRouter;
