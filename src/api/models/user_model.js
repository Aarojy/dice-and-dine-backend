import promisePool from '../../utils/database.js';

const listUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM users_wsk');
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM users_wsk WHERE user_id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

const addUser = async (user) => {
  const {username, password} = user;
  const sql = `INSERT INTO users_wsk (username, password) VALUES (?, ?)`;
  const [result] = await promisePool.execute(sql, [username, password]);
  return {user_id: result.insertId};
};

const deleteUser = async (userId) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete all cats owned by the user
    await connection.query('DELETE FROM wsk_cats WHERE owner = ?', [userId]);

    // Delete the user
    const [result] = await connection.query(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [userId]
    );

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const login = async (user) => {
  const sql = `SELECT * FROM users_wsk WHERE username = ?`;

  const [rows] = await promisePool.execute(sql, [user]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const postFavorite = async (username, favorite) => {
  console.log('postFavorite', username, favorite);
  const sql = `UPDATE users_wsk SET favorite = ? WHERE username = ?`;
  const [result] = await promisePool.execute(sql, [favorite, username]);
  return result;
};

const getFavorite = async (username) => {
  const sql = `SELECT favorite FROM users_wsk WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [username]);
  return rows.length > 0 ? rows[0].favorite : null;
};

export {
  listUsers,
  findUserById,
  addUser,
  deleteUser,
  login,
  postFavorite,
  getFavorite,
};
