const {fetchUserById } = require('../models/usersModels')

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then(user => {
      console.log(user);
      res.status(200).send({user})
    })
    .catch(next)
}