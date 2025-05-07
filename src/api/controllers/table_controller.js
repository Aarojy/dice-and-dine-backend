import {
  listTableOrders,
  createReservation,
  listTables,
  fetchTableOrder,
} from '../models/table_model.js';

/**
 * @api {get} /api/v1/tables/orders Get All Table Orders
 * @apiName GetTableOrders
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} orders List of all table orders.
 * @apiSuccess {Number} orders.id The unique ID of the table order.
 * @apiSuccess {String} orders.status The status of the table order.
 *
 * @apiError (404 Not Found) NoOrders No table orders found.
 */
export const getTableOrders = async (req, res) => {
  const result = await listTableOrders();
  if (result.length === 0) {
    res.status(404).json({message: 'No table orders found'});
    return;
  }
  res.json(result);
};

/**
 * @api {get} /api/v1/tables/orders/:id Get Table Order by ID
 * @apiName GetTableOrder
 * @apiGroup Tables
 *
 * @apiParam {Number} id The unique ID of the table order.
 *
 * @apiSuccess {Object} order The details of the table order.
 * @apiSuccess {Number} order.id The unique ID of the table order.
 * @apiSuccess {String} order.status The status of the table order.
 *
 * @apiError (404 Not Found) OrderNotFound The table order was not found.
 */
export const getTableOrder = async (req, res) => {
  const {id} = req.params;
  const result = await fetchTableOrder(id);
  if (result.length === 0) {
    res.status(404).json({message: 'No table order found'});
    return;
  }
  res.json(result);
};

/**
 * @api {get} /api/v1/tables Get All Tables
 * @apiName GetTables
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} tables List of all tables.
 * @apiSuccess {Number} tables.id The unique ID of the table.
 * @apiSuccess {String} tables.name The name of the table.
 *
 * @apiError (404 Not Found) NoTables No tables found.
 */
export const getTables = async (req, res) => {
  const result = await listTables();
  if (result.length === 0) {
    res.status(404).json({message: 'No tables found'});
    return;
  }
  res.json(result);
};

/**
 * @api {post} /api/v1/tables/reserve Reserve a Table
 * @apiName ReserveTable
 * @apiGroup Tables
 *
 * @apiBody {Object} reservation The details of the reservation.
 * @apiBody {String} reservation.arrival_time The arrival time for the reservation.
 * @apiBody {String} reservation.departure_time The departure time for the reservation.
 * @apiBody {Number[]} reservation.tables The IDs of the reserved tables.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created reservation.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToReserve Failed to reserve the table.
 */
export const reserveTable = async (req, res) => {
  const {reservation} = req.body;

  if (!req.user.id || !reservation) {
    res.status(400).json({message: 'Missing user_id or order'});
    return;
  }

  const result = await createReservation(req.user.id, reservation);
  if (result.error) {
    res.status(500).json(result);
    return;
  }

  res.status(201).json(result);
};

export default {getTableOrders, getTableOrder, reserveTable, getTables};
