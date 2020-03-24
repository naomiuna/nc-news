const {fetchTopics } = require('../models/topicsModels');

exports.getTopics = (rew, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({topics})
  })
  .catch(next)
}