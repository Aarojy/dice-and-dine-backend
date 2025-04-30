import promisePool from '../../utils/database.js';
const userTable = 'registered_customers';
const ordersTable = 'food_orders';

const listUsers = async () => {
  const [rows] = await promisePool.query(`SELECT * FROM ${userTable}`);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.query(
    `SELECT id, name, email, profile_image, user_type FROM ${userTable} WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];

  const [orders] = await promisePool.query(
    `SELECT \`order\` as order_id FROM ${ordersTable} WHERE customer = ?`,
    [id]
  );

  const [reservations] = await promisePool.query(
    `SELECT id as reservation_id FROM table_reservations WHERE customer = ?`,
    [id]
  );

  user.orders = orders.map((order) => order.order_id);
  user.reservations = reservations.map(
    (reservation) => reservation.reservation_id
  );

  return user;
};

const addUser = async (user) => {
  const {username, password, email, user_type} = user;
  const sql = `INSERT INTO ${userTable} (name, password, email, user_type) VALUES (?, ?, ?, ?)`;
  const [result] = await promisePool.execute(sql, [
    username,
    password,
    email,
    user_type,
  ]);
  return {user_id: result.insertId};
};

const deleteUser = async (userId) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `DELETE FROM ${userTable} WHERE id = ?`,
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
  const sql = `SELECT * FROM ${userTable} WHERE name = ?`;

  const [rows] = await promisePool.execute(sql, [user]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const updateUserProfileImage = async (userId, filename) => {
  const sql = `
    UPDATE ${userTable}
    SET profile_image = ?
    WHERE id = ?
  `;
  const values = [filename, userId];
  await promisePool.query(sql, values);
};

const modifyUser = async (userId, user) => {
  const updateFields = [];
  const values = [];

  // Dynamically add fields to the update query based on what is provided
  if (user.username) {
    updateFields.push('name = ?');
    values.push(user.username);
  }
  if (user.password) {
    updateFields.push('password = ?');
    values.push(user.password);
  }
  if (user.email) {
    updateFields.push('email = ?');
    values.push(user.email);
  }
  if (user.user_type) {
    updateFields.push('user_type = ?');
    values.push(user.user_type);
  }
  values.push(userId);
  const sql = `UPDATE ${userTable} SET ${updateFields.join(', ')} WHERE id = ?`;
  const [result] = await promisePool.execute(sql, values);
  if (result.affectedRows === 0) {
    return {message: 'No changes made'};
  }
  return {message: 'User updated successfully'};
};

export {
  listUsers,
  findUserById,
  addUser,
  deleteUser,
  login,
  updateUserProfileImage,
  modifyUser,
};
