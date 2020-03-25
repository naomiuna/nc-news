const {createComment } = require('../models/commentsModels')

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  createComment(article_id, username, body)
    .then(comment => {
      res.status(201).send({comment})
    })
    .catch(next)
}