import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import express from 'express';
import {
  getOrders,
  getOrderById,
  postOrder,
  postOrderStatus,
  postMenuItem,
  deleteMenuItem,
} from '../controllers/order_controller.js';

const orderRouter = express.Router();

/**
 * @api {get} /api/v1/orders Get All Orders
 * @apiName GetOrders
 * @apiGroup Orders
 *
 * @apiSuccess {Object[]} orders List of all orders.
 * @apiSuccess {Number} orders.id The unique ID of the order.
 * @apiSuccess {String} orders.status The status of the order.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the orders.
 */
orderRouter.route('/').get(getOrders);

/**
 * @api {post} /api/v1/orders/status Update Order Status
 * @apiName PostOrderStatus
 * @apiGroup Orders
 *
 * @apiBody {Number} order_id The ID of the order.
 * @apiBody {String} status The new status of the order.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the status was updated.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (400 Bad Request) InvalidStatus The provided status is invalid.
 * @apiError (500 Internal Server Error) FailedToUpdate Failed to update the order status.
 */
orderRouter.route('/status').post(authenticateToken, postOrderStatus);

/**
 * @api {post} /api/v1/orders/menu Add a Menu Item
 * @apiName PostMenuItem
 * @apiGroup Menu
 *
 * @apiBody {Object} menu_item The details of the menu item.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the menu item was added.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToAdd Failed to add the menu item.
 */
orderRouter.route('/menu/').post(authenticateToken, postMenuItem);

/**
 * @api {delete} /api/v1/orders/menu/:id Delete a Menu Item
 * @apiName DeleteMenuItem
 * @apiGroup Menu
 *
 * @apiParam {Number} id The ID of the menu item to delete.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the menu item was deleted.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToDelete Failed to delete the menu item.
 */
orderRouter.route('/menu/:id').delete(authenticateToken, deleteMenuItem);

/**
 * @api {get} /api/v1/orders/:id Get Order by ID
 * @apiName GetOrderById
 * @apiGroup Orders
 *
 * @apiParam {Number} id The unique ID of the order.
 *
 * @apiSuccess {Object} order The details of the order.
 * @apiSuccess {Number} order.id The unique ID of the order.
 * @apiSuccess {String} order.status The status of the order.
 *
 * @apiError (404 Not Found) OrderNotFound The order was not found.
 */
orderRouter.route('/:id').get(getOrderById);

/**
 * @api {post} /api/v1/orders/:username Create a New Order
 * @apiName PostOrder
 * @apiGroup Orders
 *
 * @apiParam {String} username The username of the user creating the order.
 *
 * @apiBody {Object[]} order The list of items in the order.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the order was created.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the order.
 */
orderRouter
  .route('/:username')
  .post(authenticateToken, validateUser, postOrder);

export default orderRouter;
