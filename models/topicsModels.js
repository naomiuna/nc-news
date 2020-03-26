const connection = require('../db/connection');

exports.fetchTopics = () => {
  return connection.select('*')
  .from('topics')
}
exports.fetchSingleTopic = (topic) => {
  return connection.select('*')
    .from('topics')
    .where('slug', '=', topic)
    .then(([topic]) => {
      if (!topic) {
        return Promise.reject({
          status: 404,
          msg: 'topic not found'
      })
    }
    return topic
  })
}