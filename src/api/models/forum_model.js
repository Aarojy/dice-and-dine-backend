import promisePool from '../../utils/database.js';

const listForumPosts = async () => {
  const [rows] = await promisePool.query(
    `SELECT mt.*, m.message, m.title, m.user_id, m.time
     FROM message_table mt
     JOIN message m ON mt.message_id = m.id
     WHERE mt.to_message_id IS NULL`
  );

  // Create a deep copy of rows
  let result = rows.map((row) => ({ ...row }));

  // Recursively find all child messages for each root message
  for (const row of result) {
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

  // Recursively find children for each child message
  for (const row of rows) {
    row.replies = await findChildMessages(row.id);
  }

  return rows;
};

const insertMessage = async (message, title, user_id, to_id) => {
  const [result] = await promisePool.query(
    'INSERT INTO message (title, message, user_id, time) VALUES (?, ?, ?, ?)',
    [title, message, user_id, new Date()]
  );

  await promisePool.query(
    'INSERT INTO message_table (by_user_id, message_id, to_message_id) VALUES (?, ?, ?)',
    [user_id, result.insertId, to_id]
  );

  return result;
};

export { listForumPosts, insertMessage };
