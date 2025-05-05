import {
  listOrders,
  orderById,
  createOrder,
  editOrderStatus,
  addMenuItem,
  removeMenuItem,
} from '../models/order_model.js';

const getOrders = async (req, res) => {
  const result = await listOrders();
  if (result.length === 0) {
    res.status(404).json({message: 'No orders found'});
    return;
  }
  res.json(result);
};

const getOrderById = async (req, res) => {
  const {id} = req.params;
  const result = await orderById(id);
  if (!result) {
    res.status(404).json({message: 'Order not found'});
    return;
  }
  res.json(result);
};

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
