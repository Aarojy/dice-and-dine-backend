import express from 'express';
import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import {getAllMessages, postMessage} from '../controllers/forum_controller.js';

const forumRouter = express.Router();

forumRouter.route('/').get(getAllMessages);

forumRouter
  .route('/post/:username')
  .post(authenticateToken, validateUser, postMessage);

forumRouter
  .route('/post/:to_id/:username')
  .post(authenticateToken, validateUser, postMessage);

export default forumRouter;
