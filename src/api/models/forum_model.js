import promisePool from '../../utils/database.js';

const getMessageTxt = async (message_id) => {
  const [rows] = await promisePool.query(
    'SELECT message FROM message WHERE id = ?',
    [message_id]
  );

  if (rows.length === 0) {
    throw new Error('Message not found');
  }

  return rows[0].message;
};

/**
 * @api {get} /api/v1/forum/posts Get All Forum Posts
 * @apiName GetForumPosts
 * @apiGroup Forum
 *
 * @apiSuccess {Object[]} posts List of all forum posts.
 * @apiSuccess {Number} posts.id The unique ID of the post.
 * @apiSuccess {String} posts.title The title of the post.
 * @apiSuccess {String} posts.message The content of the post.
 * @apiSuccess {Number} posts.user_id The ID of the user who created the post.
 * @apiSuccess {String} posts.time The time the post was created.
 * @apiSuccess {Object[]} posts.replies List of replies to the post.
 *
 * @apiError (404 Not Found) NoPosts No forum posts found.
 */
const listForumPosts = async () => {
  const [rows] = await promisePool.query(
    `SELECT mt.*, m.message, m.title, m.user_id, m.time
     FROM message_table mt
     JOIN message m ON mt.message_id = m.id
     WHERE mt.to_message_id IS NULL`
  );

  // Create a deep copy of rows
  let result = rows.map((row) => ({...row}));

  for (const row of result) {
    // Fetch the message text for each child message
    row.message = await getMessageTxt(row.message_id);
    //  find all child messages for each root message
    row.replies = await findChildMessages(row.id);
  }

  return result;
};

const findChildMessages = async (message_id) => {
  // Fetch all direct child messages
  const [rows] = await promisePool.query(
    `SELECT mt.*, m.message, m.title, m.user_id, m.time
     FROM message_table mt
     JOIN message m ON mt.message_id = m.id
     WHERE mt.to_message_id = ?`,
    [message_id]
  );

  for (const row of rows) {
    // Fetch the message text for each child message
    row.message = await getMessageTxt(row.message_id);
    // find children for each child message
    row.replies = await findChildMessages(row.id);
  }

  return rows;
};

/**
 * @api {post} /api/v1/forum/posts Create a New Forum Post
 * @apiName CreateForumPost
 * @apiGroup Forum
 *
 * @apiBody {String} title The title of the post.
 * @apiBody {String} message The content of the post.
 * @apiBody {Number} user_id The ID of the user creating the post.
 * @apiBody {Number} [to_id] The ID of the post being replied to (optional).
 *
 * @apiSuccess {Object} result The details of the created post.
 * @apiSuccess {Object} result.message The created post details.
 * @apiSuccess {Number} result.message.id The unique ID of the post.
 * @apiSuccess {String} result.message.title The title of the post.
 * @apiSuccess {String} result.message.message The content of the post.
 * @apiSuccess {Number} result.message.user_id The ID of the user who created the post.
 * @apiSuccess {String} result.message.time The time the post was created.
 * @apiSuccess {Number} result.message.toMessage The ID of the post being replied to (if applicable).
 * @apiSuccess {Number} result.message.messageTableId The ID of the message table entry.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the forum post.
 */
const insertMessage = async (message, title, user_id, to_id) => {
  const [result] = await promisePool.query(
    'INSERT INTO message (title, message, user_id, time) VALUES (?, ?, ?, ?)',
    [title, message, user_id, new Date()]
  );

  await promisePool.query(
    'INSERT INTO message_table (by_user_id, message_id, to_message_id) VALUES (?, ?, ?)',
    [user_id, result.insertId, to_id]
  );

  const [insertedMessage] = await promisePool.query(
    'SELECT * FROM message WHERE id = ?',
    [result.insertId]
  );

  const [insertedMessageTable] = await promisePool.query(
    'SELECT * FROM message_table WHERE message_id = ?',
    [result.insertId]
  );
  insertedMessage[0].toMessage = insertedMessageTable[0].to_message_id;
  insertedMessage[0].messageTableId = insertedMessageTable[0].id;

  return {
    result: result,
    message: insertedMessage[0],
  };
};

export {listForumPosts, insertMessage};
