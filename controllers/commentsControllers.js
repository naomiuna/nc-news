const {createComment } = require('../models/commentsModels')

exports.postComment = (req, res, next) => {
 if (Object.keys(req.body).length > 2) {
   return next({ status: 400, msg: 'bad request' });
 }

  const { article_id } = req.params;
  const { username, body } = req.body;
  createComment(article_id, username, body)
    .then(comment => {
      res.status(201).send({comment})
    })
    .catch(next)
}