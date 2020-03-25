const connection = require('../db/connection');

exports.createComment = (article_id, author, body) => {
  return connection
    .insert({ article_id, author, body })
    .into('comments')
    .returning('*')
  .then(([comment])=> comment)
}