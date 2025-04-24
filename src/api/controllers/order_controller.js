import {listOrders, orderById, createOrder} from '../models/order_model.js';

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
  const {customer_id, order} = req.body;

  if (!customer_id || !order) {
    res.status(400).json({message: 'Missing required fields'});
    return;
  }

  const result = await createOrder(customer_id, order);

  if (!result) {
    res.status(500).json({message: 'Failed to create order'});
    return;
  }

  res.status(201).json(result);
};

export {getOrders, getOrderById, postOrder};
