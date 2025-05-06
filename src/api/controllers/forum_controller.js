import {insertMessage, listForumPosts} from '../models/forum_model.js';

export const getAllMessages = async (req, res) => {
  const result = await listForumPosts();
  if (result.length === 0) {
    res.status(404).json({message: 'No messages found'});
    return;
  }
  res.json(result);
};

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
