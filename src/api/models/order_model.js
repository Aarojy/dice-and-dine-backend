import promisePool from '../../utils/database.js';
import {findUserById} from './user_model.js';

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
      ({id, order_id, ...rest}) => rest
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

const orderById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM food_orders WHERE `order` = ?',
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

  return rows[0];
};

const subOrderById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM `order` WHERE order_id = ?',
    [id]
  );
  return rows;
};

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

export {listOrders, orderById, createOrder, subOrderById};
