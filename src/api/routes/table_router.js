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

tableRouter.route('/').get(getTableOrders);

tableRouter.route('/tables').get(getTables);

tableRouter.route('/:id').get(getTableOrder);

tableRouter
  .route('/reserve/:username')
  .post(authenticateToken, validateUser, reserveTable);

export default tableRouter;
