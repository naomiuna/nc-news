
exports.up = function(knex) {
  console.log('creating comments table');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').references('users.username').notNullable();
    commentsTable.integer('artcle_id').references('articles.article_id').notNullable();
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.string('body', 5000).notNullable();
  })
};

exports.down = function(knex) {
  console.log('deleting comments table');
  return knex.schema.dropTable('comments');
};
