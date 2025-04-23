import {authUser, getMe} from '../controllers/auth_controller.js';
import express from 'express';
import {authenticateToken} from '../../middlewares.js';

const authRouter = express.Router();

authRouter.route('/login').post(authUser);

authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
