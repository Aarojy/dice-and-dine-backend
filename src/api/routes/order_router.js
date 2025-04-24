import express from 'express';
import {
  getOrders,
  getOrderById,
  postOrder,
} from '../controllers/order_controller.js';

const orderRouter = express.Router();

orderRouter.route('/').get(getOrders);

orderRouter.route('/:id').get(getOrderById);

orderRouter.route('/').post(postOrder);

export default orderRouter;
