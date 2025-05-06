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
