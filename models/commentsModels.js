const connection = require('../db/connection');

exports.createComment = (article_id, author, body) => {
  return connection
    .insert({ article_id, author, body })
    .into('comments')
    .returning('*')
    .then(([comment]) => comment);
};

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
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where({ article_id })
    .orderBy(sort_by || 'created_at', order || 'desc');
};

exports.updateCommentById = (comment_id, votes) => {
  return connection('comments')
    .where({ comment_id })
    .increment({ votes })
    .returning('*')
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: 'comment not found'
        });
      }
      return comment;
    });
};

exports.removeCommentById = comment_id => {
  return connection('comments')
    .where(comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'comment not found'
        });
      }
    });
};
