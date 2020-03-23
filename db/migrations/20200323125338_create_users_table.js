
exports.up = function(knex) {
  console.log('creating users table');
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.string('username').primary();
    usersTable.string('name').notNullable();
    usersTable.string('avatar_url').notNullable();
  })
};

exports.down = function(knex) {
  console.log('deleting users table');
  return knex.schema.dropTable('users');
};
