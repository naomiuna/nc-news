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
  const orders = [undefined, 'asc', 'desc'];
  if (!orders.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: 'bad request'
    });
  }
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