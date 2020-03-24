const usersRouter = require('express').Router();
const { getUserById } = require('../controllers/usersControllers');

usersRouter.route('/:username')
.get(getUserById)

module.exports = usersRouter;
