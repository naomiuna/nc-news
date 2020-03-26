const commentsRouter = require('express').Router();
const {patchCommentById} = require('../controllers/commentsControllers');

commentsRouter.route('/:comment_id')
.patch(patchCommentById)

module.exports = commentsRouter;
