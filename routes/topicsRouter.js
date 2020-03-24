const topicsRouter = require('express').Router();
const { } = require('../controllers/topicsController');
const { getTopics } = require('../controllers/topicsController')

topicsRouter.route('/')
.get(getTopics)

module.exports = topicsRouter;