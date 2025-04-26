import express from 'express';
import authRouter from './routes/auth_router.js';
import userRouter from './routes/user_router.js';
import infoRouter from './routes/info_router.js';
import orderRouter from './routes/order_router.js';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/info', infoRouter);

router.use('/orders', orderRouter);

export default router;
