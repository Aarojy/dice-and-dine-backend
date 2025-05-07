import {insertMessage, listForumPosts} from '../models/forum_model.js';

/**
 * @api {get} /api/v1/forum/messages Get All Messages
 * @apiName GetAllMessages
 * @apiGroup Forum
 *
 * @apiSuccess {Object[]} messages List of all forum messages.
 * @apiSuccess {Number} messages.id The unique ID of the message.
 * @apiSuccess {String} messages.title The title of the message.
 * @apiSuccess {String} messages.message The content of the message.
 * @apiSuccess {Number} messages.user_id The ID of the user who posted the message.
 * @apiSuccess {String} messages.time The time the message was posted.
 *
 * @apiError (404 Not Found) NoMessages No messages found in the forum.
 */
export const getAllMessages = async (req, res) => {
  const result = await listForumPosts();
  if (result.length === 0) {
    res.status(404).json({message: 'No messages found'});
    return;
  }
  res.json(result);
};

/**
 * @api {post} /api/v1/forum/messages Post a New Message
 * @apiName PostMessage
 * @apiGroup Forum
 *
 * @apiBody {String} message The content of the message.
 * @apiBody {String} title The title of the message.
 * @apiBody {Number} [to_id] The ID of the message being replied to (optional).
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the message was posted.
 * @apiSuccess {Object} result The details of the posted message.
 *
 * @apiError (400 Bad Request) MissingFields Message and user ID are required.
 * @apiError (500 Internal Server Error) FailedToPost Failed to post the message or reply.
 */
export const postMessage = async (req, res) => {
  const {message, title} = req.body;

  if (!message || !req.user.id) {
    res.status(400).json({message: 'Message and user ID are required'});
    return;
  }

  let result = null;
  if (!req.params.to_id) {
    result = await insertMessage(message, title, req.user.id, null);
    if (result.result.affectedRows === 0) {
      res.status(500).json({message: 'Failed to post message'});
      return;
    }
  } else {
    result = await insertMessage(message, title, req.user.id, req.params.to_id);
    if (result.result.affectedRows === 0) {
      res.status(500).json({message: 'Failed to post reply'});
      return;
    }
  }
  res.status(201).json({
    message: 'Message posted successfully',
    result: result.message,
  });
};

export default {getAllMessages, postMessage};
