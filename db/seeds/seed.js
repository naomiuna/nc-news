const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticles = formatDates(articleData);
      return knex('articles')
        .insert(formattedArticles)
        .returning('*');
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      const formattedDateComments = formatDates(commentData);
      const formattedComments = formatComments(
        formattedDateComments,
        articleRef
      );
      return knex('comments').insert(formattedComments);
    });
};
