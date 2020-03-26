const {
  createComment,
  fetchComments,
  updateCommentById,
  removeCommentById
} = require('../models/commentsModels');
const { fetchArticleById } = require('../models/articlesModels');

exports.postComment = (req, res, next) => {
  if (Object.keys(req.body).length > 2) {
    return next({ status: 400, msg: 'bad request' });
  }

  const { article_id } = req.params;
  const { username, body } = req.body;
  createComment(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  return Promise.all([
    fetchComments(article_id, req.query),
    fetchArticleById(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  if (Object.keys(req.body).length > 1) {
    return next({ status: 400, msg: 'bad request' });
  }
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(() => res.sendStatus(204))
    .catch(next);
};
