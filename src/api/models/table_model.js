import promisePool from '../../utils/database.js';
import {findUserById} from './user_model.js';

/**
 * @api {get} /api/v1/tables/orders/:id Get Table Order by ID
 * @apiName GetTableOrder
 * @apiGroup Tables
 *
 * @apiParam {Number} id The unique ID of the table order.
 *
 * @apiSuccess {Object} order The details of the table order.
 * @apiSuccess {Number} order.id The unique ID of the table order.
 * @apiSuccess {Object} order.customer The details of the customer (excluding password and user type).
 * @apiSuccess {Number[]} order.tables The list of table IDs associated with the reservation.
 *
 * @apiError (404 Not Found) OrderNotFound The table order was not found.
 */
export const fetchTableOrder = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM table_reservations WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const user = await findUserById(rows[0].customer);

  // eslint-disable-next-line no-unused-vars
  const {password, user_type, ...userWithoutPassword} = user;
  rows[0].customer = userWithoutPassword;

  const reservation = await promisePool.query(
    'SELECT table_id FROM table_table WHERE reservation_id = ?',
    [id]
  );

  rows[0].tables = reservation[0].map((table) => table.table_id);

  return rows[0];
};

/**
 * @api {get} /api/v1/tables/orders Get All Table Orders
 * @apiName GetTableOrders
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} orders List of all table orders.
 * @apiSuccess {Number} orders.id The unique ID of the table order.
 * @apiSuccess {Object} orders.customer The details of the customer (excluding password and user type).
 * @apiSuccess {Number[]} orders.tables The list of table IDs associated with the reservation.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the table orders.
 */
export const listTableOrders = async () => {
  const [rows] = await promisePool.query('SELECT * FROM table_reservations');

  for (const row of rows) {
    const user = await findUserById(row.customer);

    // eslint-disable-next-line no-unused-vars
    const {password, user_type, ...userWithoutPassword} = user;
    row.customer = userWithoutPassword;

    const reservation = await promisePool.query(
      'SELECT table_id FROM table_table WHERE reservation_id = ?',
      [row.id]
    );

    row.tables = reservation[0].map((table) => table.table_id);
  }

  return rows;
};

/**
 * @api {get} /api/v1/tables Get All Tables
 * @apiName GetTables
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} tables List of all tables.
 * @apiSuccess {Number} tables.id The unique ID of the table.
 * @apiSuccess {String} tables.name The name of the table.
 * @apiSuccess {Number} tables.capacity The capacity of the table.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the tables.
 */
export const listTables = async () => {
  const tables = await promisePool.query('SELECT * FROM tables');
  return tables[0];
};

/**
 * @api {post} /api/v1/tables/reservations Create a New Table Reservation
 * @apiName CreateReservation
 * @apiGroup Tables
 *
 * @apiBody {String} arrival_time The arrival time for the reservation.
 * @apiBody {String} departure_time The departure time for the reservation.
 * @apiBody {Number} reservation_size The size of the reservation.
 * @apiBody {String} [additional_information] Additional information for the reservation (optional).
 * @apiBody {Number[]} tables The list of table IDs to reserve.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created reservation.
 * @apiSuccess {Number} result.reservation_id The unique ID of the created reservation.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the table reservation.
 */
export const createReservation = async (customer_id, reservation) => {
  const {
    arrival_time,
    departure_time,
    reservation_size,
    additional_information,
    tables,
  } = reservation;

  // Insert into table_reservations
  const [reservationResult] = await promisePool.query(
    'INSERT INTO table_reservations (customer, arrival_time, departure_time, reservation_size, additional_information) VALUES (?, ?, ?, ?, ?)',
    [
      customer_id,
      arrival_time,
      departure_time,
      reservation_size,
      additional_information,
    ]
  );

  const reservationId = reservationResult.insertId; // Get the generated reservation ID

  // Insert into table_table for each table
  for (const table of tables) {
    await promisePool.query(
      'INSERT INTO table_table (reservation_id, table_id) VALUES (?, ?)',
      [reservationId, table]
    );
  }

  return {reservation_id: reservationId};
};

export default {
  listTableOrders,
  createReservation,
  listTables,
  fetchTableOrder,
};
