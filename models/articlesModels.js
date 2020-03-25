const connection = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  return connection
    .select('articles.*')
    .from('articles')
    .where('articles.article_id', '=', article_id)
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg:'article not found'
        })
      }
      return article;
  })
}

exports.updateArticleById = (article_id, votes) => {
  return connection('articles')
    .where({article_id})
    .increment({votes})
    .returning('*')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'article not found'
        })
      }
      return article;
    })
}