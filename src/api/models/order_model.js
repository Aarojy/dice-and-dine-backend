import promisePool from '../../utils/database.js';
import {findUserById} from './user_model.js';

/**
 * @api {get} /api/v1/orders Get All Orders
 * @apiName GetOrders
 * @apiGroup Orders
 *
 * @apiSuccess {Object[]} orders List of all orders.
 * @apiSuccess {Number} orders.id The unique ID of the order.
 * @apiSuccess {Object} orders.customer The details of the customer (excluding password and user type).
 * @apiSuccess {Object[]} orders.order The list of items in the order.
 * @apiSuccess {Object} orders.order.menu_item The details of the menu item.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the orders.
 */
const listOrders = async () => {
  const [rows] = await promisePool.query('SELECT * FROM food_orders');

  for (const row of rows) {
    const user = await findUserById(row.customer);

    // eslint-disable-next-line no-unused-vars
    const {password, user_type, ...userWithoutPassword} = user;
    row.customer = userWithoutPassword;

    const orderItems = await subOrderById(row.order);
    const filteredOrderItems = orderItems.map(
      // eslint-disable-next-line no-unused-vars
      ({id, ...rest}) => rest
    );
    row.order = filteredOrderItems;

    for (const item of row.order) {
      const menuItem = await promisePool.query(
        'SELECT * FROM menu WHERE id = ?',
        [item.menu_item_id]
      );
      item.menu_item = menuItem[0][0];
    }
    // eslint-disable-next-line no-unused-vars
    ({menu_item_id, ...rest}) => rest;

    row.order = filteredOrderItems;
  }

  return rows;
};

/**
 * @api {get} /api/v1/orders/:id Get Order by ID
 * @apiName GetOrderById
 * @apiGroup Orders
 *
 * @apiParam {Number} id The unique ID of the order.
 *
 * @apiSuccess {Object} order The details of the order.
 * @apiSuccess {Object} order.customer The details of the customer (excluding password and user type).
 * @apiSuccess {Object[]} order.order The list of items in the order.
 * @apiSuccess {Object} order.order.menu_item The details of the menu item.
 *
 * @apiError (404 Not Found) OrderNotFound The order was not found.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the order.
 */
const orderById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT customer, `order`, time FROM food_orders WHERE `order` = ?',
    [id]
  );

  const user = await findUserById(rows[0].customer);

  // eslint-disable-next-line no-unused-vars
  const {password, user_type, ...userWithoutPassword} = user;

  rows[0].customer = userWithoutPassword;

  const orderItems = await subOrderById(rows[0].order);
  const filteredOrderItems = orderItems.map(
    // eslint-disable-next-line no-unused-vars
    ({id, order_id, ...rest}) => rest
  );

  rows[0].order = filteredOrderItems;

  for (const item of rows[0].order) {
    const menuItem = await promisePool.query(
      'SELECT * FROM menu WHERE id = ?',
      [item.menu_item_id]
    );
    item.menu_item = menuItem[0][0];
  }
  // eslint-disable-next-line no-unused-vars
  ({menu_item_id, ...rest}) => rest;

  rows[0].order = filteredOrderItems;
  rows[0].id = id;

  return rows[0];
};

const subOrderById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM `order` WHERE order_id = ?',
    [id]
  );
  return rows;
};

/**
 * @api {post} /api/v1/orders Create a New Order
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiBody {Object[]} order The list of items in the order.
 * @apiBody {Number} order.item_id The ID of the menu item.
 * @apiBody {Number} order.quantity The quantity of the menu item.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the order was created.
 * @apiSuccess {Number} order_id The unique ID of the created order.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the order.
 */
const createOrder = async (user_id, order) => {
  const time = new Date();
  let maxOrderId = null;

  try {
    // Fetch the max order_id from the database
    const orderIdResult = await promisePool.query(
      'SELECT MAX(order_id) AS `maxOrderId` FROM `order`'
    );
    maxOrderId = orderIdResult[0][0].maxOrderId;

    // Insert the new orders into the database
    for (const item of order) {
      await promisePool.query(
        'INSERT INTO `order` (order_id, menu_item_id, amount, status) VALUES (?, ?, ?, ?)',
        [maxOrderId + 1, item.item_id, item.quantity, 'pending']
      );
    }

    // Insert the order into the food_orders table
    await promisePool.query(
      'INSERT INTO food_orders (customer, `order`, time) VALUES (?, ?, ?)',
      [user_id, maxOrderId + 1, time]
    );
  } catch (error) {
    return {message: 'Failed to create order', error: error};
  }

  return {
    message: 'Order created successfully',
    order_id: maxOrderId + 1,
  };
};

/**
 * @api {put} /api/v1/orders/:id Update Order Status
 * @apiName EditOrderStatus
 * @apiGroup Orders
 *
 * @apiParam {Number} id The unique ID of the order.
 *
 * @apiBody {String} status The new status of the order.
 *
 * @apiSuccess {String} message Success message indicating the order status was updated.
 *
 * @apiError (404 Not Found) OrderNotFound The order was not found.
 * @apiError (500 Internal Server Error) FailedToUpdate Failed to update the order status.
 */
const editOrderStatus = async (order_id, status) => {
  try {
    const [rows] = await promisePool.query(
      'UPDATE `order` SET status = ? WHERE order_id = ?',
      [status, order_id]
    );
    if (rows.affectedRows === 0) {
      return {message: 'No order found with that ID'};
    }
    return {message: 'Order status updated successfully'};
  } catch (error) {
    console.error(error);
    return {message: 'Failed to update order status', error: error};
  }
};

/**
 * @api {delete} /api/v1/menu-items/:id Delete Menu Item
 * @apiName RemoveMenuItem
 * @apiGroup Menu
 *
 * @apiParam {Number} id The unique ID of the menu item.
 *
 * @apiSuccess {String} message Success message indicating the menu item was deleted.
 *
 * @apiError (404 Not Found) MenuItemNotFound The menu item was not found.
 * @apiError (500 Internal Server Error) FailedToDelete Failed to delete the menu item.
 */
const removeMenuItem = async (id) => {
  try {
    const [rows] = await promisePool.query('DELETE FROM `menu` WHERE id = ?', [
      id,
    ]);
    if (rows.affectedRows === 0) {
      return {message: 'No order found with that ID'};
    }
    await promisePool.query(
      'DELETE FROM allergen_table WHERE menu_item_id = ?',
      [id]
    );
    await promisePool.query(
      'DELETE FROM category_table WHERE menu_item_id = ?',
      [id]
    );

    return {message: 'Order deleted successfully'};
  } catch (error) {
    console.error(error);
    return {message: 'Failed to delete order', error: error};
  }
};

/**
 * @api {post} /api/v1/menu-items Add Menu Item
 * @apiName AddMenuItem
 * @apiGroup Menu
 *
 * @apiBody {String} name The name of the menu item.
 * @apiBody {Number} price The price of the menu item.
 * @apiBody {String} description The description of the menu item.
 * @apiBody {String} lang The language of the menu item.
 * @apiBody {Number[]} allergens The list of allergen IDs associated with the menu item.
 * @apiBody {Number[]} categories The list of category IDs associated with the menu item.
 *
 * @apiSuccess {String} message Success message indicating the menu item was added.
 *
 * @apiError (500 Internal Server Error) FailedToAdd Failed to add the menu item.
 */
const addMenuItem = async (menu_item) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO menu (name, price, description, lang) VALUES (?, ?, ?, ?)',
      [menu_item.name, menu_item.price, menu_item.description, menu_item.lang]
    );

    const [menuMax] = await promisePool.query(
      'SELECT MAX(id) AS `maxId` FROM menu'
    );
    const maxId = menuMax[0].maxId;

    for (const allergen of menu_item.allergens) {
      await promisePool.query(
        'INSERT INTO allergen_table (allergen_id, menu_item_id) VALUES (?, ?)',
        [allergen, maxId]
      );
    }

    for (const category of menu_item.categories) {
      await promisePool.query(
        'INSERT INTO category_table (category_id, menu_item_id) VALUES (?, ?)',
        [category, maxId]
      );
    }

    if (rows.affectedRows === 0) {
      return {message: 'Failed to add menu item'};
    }
    return {message: 'Menu item added successfully'};
  } catch (error) {
    console.error(error);
    return {message: 'Failed to add menu item', error: error};
  }
};

export {
  listOrders,
  orderById,
  createOrder,
  subOrderById,
  editOrderStatus,
  removeMenuItem,
  addMenuItem,
};
