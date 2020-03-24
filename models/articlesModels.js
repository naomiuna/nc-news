const connection = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  return connection
    .select('articles.*')
    .from('articles')
    .where('articles.article_id', '=', article_id)
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .join('users', 'articles.author', '=', 'users.username')
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
//need to join user?