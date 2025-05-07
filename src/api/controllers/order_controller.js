import {
  listOrders,
  orderById,
  createOrder,
  editOrderStatus,
  addMenuItem,
  removeMenuItem,
} from '../models/order_model.js';

/**
 * @api {get} /api/v1/orders Get All Orders
 * @apiName GetOrders
 * @apiGroup Orders
 *
 * @apiSuccess {Object[]} orders List of all orders.
 * @apiSuccess {Number} orders.id The unique ID of the order.
 * @apiSuccess {String} orders.status The status of the order.
 *
 * @apiError (404 Not Found) NoOrders No orders found.
 */
const getOrders = async (req, res) => {
  const result = await listOrders();
  if (result.length === 0) {
    res.status(404).json({message: 'No orders found'});
    return;
  }
  res.json(result);
};

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
const getOrderById = async (req, res) => {
  const {id} = req.params;
  const result = await orderById(id);
  if (!result) {
    res.status(404).json({message: 'Order not found'});
    return;
  }
  res.json(result);
};

/**
 * @api {post} /api/v1/orders Create a New Order
 * @apiName PostOrder
 * @apiGroup Orders
 *
 * @apiBody {Object} order The details of the order.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created order.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the order.
 */
const postOrder = async (req, res) => {
  const {order} = req.body;

  if (!req.user.id || !order) {
    res.status(400).json({message: 'Missing required fields'});
    return;
  }

  const result = await createOrder(req.user.id, order);

  if (!result) {
    res.status(500).json({message: 'Failed to create order'});
    return;
  }

  res.status(201).json(result);
};

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
const postOrderStatus = async (req, res) => {
  const {order_id, status} = req.body;

  if (req.user.user_type !== 'admin') {
    return res.status(403).json({message: 'Unauthorized'});
  }

  if (!order_id || !status) {
    return res.status(400).json({message: 'Missing required fields'});
  }

  const validStatuses = [
    'pending',
    'confirmed',
    'ready',
    'completed',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({message: 'Invalid status value'});
  }

  const result = await editOrderStatus(order_id, status);

  if (result.message !== 'Order status updated successfully') {
    return res.status(500).json(result);
  }

  return res.status(200).json(result);
};

/**
 * @api {post} /api/v1/menu-items Add a Menu Item
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
const postMenuItem = async (req, res) => {
  const {menu_item} = req.body;

  if (req.user.user_type !== 'admin') {
    return res.status(403).json({message: 'Unauthorized'});
  }

  if (!menu_item) {
    return res.status(400).json({message: 'Missing required fields'});
  }

  const result = await addMenuItem(menu_item);

  if (!result) {
    return res.status(500).json({message: 'Failed to add menu item'});
  }

  return res.status(201).json({message: 'Menu item added successfully'});
};

/**
 * @api {delete} /api/v1/menu-items/:id Delete a Menu Item
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
const deleteMenuItem = async (req, res) => {
  const {id} = req.params;

  if (req.user.user_type !== 'admin') {
    return res.status(403).json({message: 'Unauthorized'});
  }

  if (!id) {
    return res.status(400).json({message: 'Missing required fields'});
  }

  const result = await removeMenuItem(id);

  if (!result) {
    return res.status(500).json({message: 'Failed to delete menu item'});
  }

  return res.status(200).json({message: 'Menu item deleted successfully'});
};

export {
  getOrders,
  getOrderById,
  postOrder,
  postOrderStatus,
  postMenuItem,
  deleteMenuItem,
};
