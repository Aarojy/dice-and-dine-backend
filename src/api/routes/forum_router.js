import express from 'express';
import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import {getAllMessages, postMessage} from '../controllers/forum_controller.js';

const forumRouter = express.Router();

/**
 * @api {get} /api/v1/forum Get All Forum Messages
 * @apiName GetAllMessages
 * @apiGroup Forum
 *
 * @apiSuccess {Object[]} messages List of all forum messages.
 * @apiSuccess {Number} messages.id The unique ID of the message.
 * @apiSuccess {String} messages.title The title of the message.
 * @apiSuccess {String} messages.message The content of the message.
 * @apiSuccess {Number} messages.user_id The ID of the user who posted the message.
 * @apiSuccess {String} messages.time The time the message was posted.
 * @apiSuccess {Object[]} messages.replies List of replies to the message.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the messages.
 */
forumRouter.route('/').get(getAllMessages);

/**
 * @api {post} /api/v1/forum/post/:username Post a New Forum Message
 * @apiName PostMessage
 * @apiGroup Forum
 *
 * @apiParam {String} username The username of the user posting the message.
 *
 * @apiBody {String} title The title of the message.
 * @apiBody {String} message The content of the message.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the message was posted.
 * @apiSuccess {Object} result The details of the posted message.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while posting the message.
 */
forumRouter
  .route('/post/:username')
  .post(authenticateToken, validateUser, postMessage);

/**
 * @api {post} /api/v1/forum/post/:to_id/:username Reply to a Forum Message
 * @apiName ReplyToMessage
 * @apiGroup Forum
 *
 * @apiParam {Number} to_id The ID of the message being replied to.
 * @apiParam {String} username The username of the user replying to the message.
 *
 * @apiBody {String} title The title of the reply.
 * @apiBody {String} message The content of the reply.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the reply was posted.
 * @apiSuccess {Object} result The details of the posted reply.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while posting the reply.
 */
forumRouter
  .route('/post/:to_id/:username')
  .post(authenticateToken, validateUser, postMessage);

export default forumRouter;
