import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import {
  getTableOrders,
  getTableOrder,
  reserveTable,
  getTables,
} from '../controllers/table_controller.js';
import express from 'express';

const tableRouter = express.Router();

/**
 * @api {get} /api/v1/tables/orders Get All Table Orders
 * @apiName GetTableOrders
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} orders List of all table orders.
 * @apiSuccess {Number} orders.id The unique ID of the table order.
 * @apiSuccess {String} orders.status The status of the table order.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the table orders.
 */
tableRouter.route('/').get(getTableOrders);

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
tableRouter.route('/tables').get(getTables);

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
tableRouter.route('/:id').get(getTableOrder);

/**
 * @api {post} /api/v1/tables/reserve/:username Reserve a Table
 * @apiName ReserveTable
 * @apiGroup Tables
 *
 * @apiParam {String} username The username of the user reserving the table.
 *
 * @apiBody {Object} reservation The details of the reservation.
 * @apiBody {String} reservation.arrival_time The arrival time for the reservation.
 * @apiBody {String} reservation.departure_time The departure time for the reservation.
 * @apiBody {Number[]} reservation.tables The list of table IDs to reserve.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created reservation.
 * @apiSuccess {Number} result.reservation_id The unique ID of the created reservation.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the table reservation.
 */
tableRouter
  .route('/reserve/:username')
  .post(authenticateToken, validateUser, reserveTable);

export default tableRouter;
