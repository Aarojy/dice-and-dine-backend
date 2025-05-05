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

orderRouter.route('/').get(getOrders);

orderRouter.route('/status').post(authenticateToken, postOrderStatus);

orderRouter.route('/menu/').post(authenticateToken, postMenuItem);

orderRouter.route('/menu/:id').delete(authenticateToken, deleteMenuItem);

orderRouter.route('/:id').get(getOrderById);

orderRouter
  .route('/:username')
  .post(authenticateToken, validateUser, postOrder);

export default orderRouter;
