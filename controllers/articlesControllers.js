const { fetchArticleById, updateArticleById, fetchArticles } = require('../models/articlesModels')
const { fetchUserByUsername } = require('../models/usersModels')
const {fetchSingleTopic} = require('../models/topicsModels')

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({article})
    })
  .catch(next)
}

exports.patchArticleById = (req, res, next) => {
  if (Object.keys(req.body).length > 1) {
    return next({ status: 400, msg: 'bad request' });
  }
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(article => {
    res.status(200).send({article})
    })
  .catch(next)
}

exports.getArticles = (req, res, next) => {
  const promiseArr = [fetchArticles(req.query)]
  if(req.query.author) promiseArr.push(fetchUserByUsername(req.query.author))
  if(req.query.topic) promiseArr.push(fetchSingleTopic(req.query.topic))
  return Promise.all(promiseArr)
    .then(([articles]) => {
    res.status(200).send({articles})
    })
  .catch(next)
}