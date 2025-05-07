import promisePool from '../../utils/database.js';
const userTable = 'registered_customers';
const ordersTable = 'food_orders';

/**
 * @api {get} /api/v1/users Get All Users
 * @apiName ListUsers
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} users List of all users.
 * @apiSuccess {Number} users.id The unique ID of the user.
 * @apiSuccess {String} users.name The name of the user.
 * @apiSuccess {String} users.email The email of the user.
 * @apiSuccess {String} users.profile_image The profile image of the user.
 * @apiSuccess {String} users.user_type The type of the user (e.g., admin, customer).
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the users.
 */
const listUsers = async () => {
  const [rows] = await promisePool.query(`SELECT * FROM ${userTable}`);
  return rows;
};

/**
 * @api {get} /api/v1/users/:id Get User by ID
 * @apiName GetUserById
 * @apiGroup Users
 *
 * @apiParam {Number} id The unique ID of the user.
 *
 * @apiSuccess {Object} user The details of the user.
 * @apiSuccess {Number} user.id The unique ID of the user.
 * @apiSuccess {String} user.name The name of the user.
 * @apiSuccess {String} user.email The email of the user.
 * @apiSuccess {String} user.profile_image The profile image of the user.
 * @apiSuccess {String} user.user_type The type of the user (e.g., admin, customer).
 * @apiSuccess {String[]} user.orders The list of order IDs associated with the user.
 * @apiSuccess {String[]} user.reservations The list of reservation IDs associated with the user.
 *
 * @apiError (404 Not Found) UserNotFound The user was not found.
 */
const findUserById = async (id) => {
  const [rows] = await promisePool.query(
    `SELECT id, name, email, profile_image, user_type, password FROM ${userTable} WHERE id = ?`,
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

/**
 * @api {post} /api/v1/users Add a New User
 * @apiName AddUser
 * @apiGroup Users
 *
 * @apiBody {String} username The username of the user.
 * @apiBody {String} password The password of the user.
 * @apiBody {String} email The email address of the user.
 * @apiBody {String} user_type The type of the user (e.g., admin, customer).
 *
 * @apiSuccess {Object} user The details of the created user.
 * @apiSuccess {Number} user.user_id The unique ID of the created user.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while adding the user.
 */
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

/**
 * @api {delete} /api/v1/users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiParam {Number} id The unique ID of the user to delete.
 *
 * @apiSuccess {String} message Success message indicating the user was deleted.
 *
 * @apiError (404 Not Found) UserNotFound The user was not found.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while deleting the user.
 */
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

/**
 * @api {post} /api/v1/users/login Login User
 * @apiName LoginUser
 * @apiGroup Users
 *
 * @apiBody {String} username The username of the user.
 *
 * @apiSuccess {Object} user The details of the logged-in user.
 * @apiSuccess {Number} user.id The unique ID of the user.
 * @apiSuccess {String} user.name The name of the user.
 * @apiSuccess {String} user.email The email of the user.
 * @apiSuccess {String} user.user_type The type of the user (e.g., admin, customer).
 *
 * @apiError (401 Unauthorized) InvalidCredentials The username or password is incorrect.
 */
const login = async (user) => {
  const sql = `SELECT * FROM ${userTable} WHERE name = ?`;

  const [rows] = await promisePool.execute(sql, [user]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

/**
 * @api {put} /api/v1/users/:id/profile-image Update User Profile Image
 * @apiName UpdateUserProfileImage
 * @apiGroup Users
 *
 * @apiParam {Number} id The unique ID of the user.
 *
 * @apiBody {String} filename The filename of the new profile image.
 *
 * @apiSuccess {String} message Success message indicating the profile image was updated.
 *
 * @apiError (404 Not Found) UserNotFound The user was not found.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the profile image.
 */
const updateUserProfileImage = async (userId, filename) => {
  const sql = `
    UPDATE ${userTable}
    SET profile_image = ?
    WHERE id = ?
  `;
  const values = [filename, userId];
  await promisePool.query(sql, values);
};

/**
 * @api {put} /api/v1/users/:id Update User
 * @apiName ModifyUser
 * @apiGroup Users
 *
 * @apiParam {Number} id The unique ID of the user.
 *
 * @apiBody {String} [username] The new username of the user.
 * @apiBody {String} [password] The new password of the user.
 * @apiBody {String} [email] The new email address of the user.
 * @apiBody {String} [user_type] The new type of the user (e.g., admin, customer).
 *
 * @apiSuccess {String} message Success message indicating the user was updated.
 *
 * @apiError (400 Bad Request) MissingFields No fields to update.
 * @apiError (404 Not Found) UserNotFound The user was not found.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the user.
 */
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
