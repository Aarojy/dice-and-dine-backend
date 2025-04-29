import {
  listTableOrders,
  createReservation,
  listTables,
} from '../models/table_model.js';

export const getTableOrders = async (req, res) => {
  const result = await listTableOrders();
  if (result.length === 0) {
    res.status(404).json({message: 'No table orders found'});
    return;
  }
  res.json(result);
};

export const getTables = async (req, res) => {
  const result = await listTables();
  if (result.length === 0) {
    res.status(404).json({message: 'No tables found'});
    return;
  }
  res.json(result);
};

export const reserveTable = async (req, res) => {
  const {customer_id, reservation} = req.body;

  if (!customer_id || !reservation) {
    res.status(400).json({message: 'Missing user_id or order'});
    return;
  }

  const result = await createReservation(customer_id, reservation);
  if (result.error) {
    res.status(500).json(result);
    return;
  }

  res.status(201).json(result);
};

export default {getTableOrders};
