const connection = require('../db/connection');

exports.createComment = (article_id, author, body) => {
  return connection
    .insert({ article_id, author, body })
    .into('comments')
    .returning('*')
  .then(([comment])=> comment)
}

exports.fetchComments = (article_id, query) => {
  const { sort_by, order } = query;
  return connection
    .select(
      'comment_id',
      'votes',
      'created_at',
      'author',
      'body'
    )
  .from('comments')
    .where({ article_id })
  .orderBy((sort_by || 'created_at'), (order || 'desc'))
}