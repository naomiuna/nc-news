const { createComment, fetchComments } = require('../models/commentsModels')
const {fetchArticleById} = require('../models/articlesModels')

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

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  
  return Promise.all([fetchArticleById(article_id), fetchComments(article_id, req.query)])
    .then(([, comments]) => {
      res.status(200).send({ comments })
    })
    .catch(next);
}