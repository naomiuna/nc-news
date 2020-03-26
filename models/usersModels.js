const connection = require('../db/connection');

exports.fetchUserByUsername = username => {
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: 'username not found'
        });
      }
      return user;
    });
};
