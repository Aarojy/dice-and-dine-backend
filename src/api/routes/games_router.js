import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import express from 'express';
import {
  getGameReservations,
  postGameReservation,
} from '../controllers/games_controller.js';

const gamesRouter = express.Router();

gamesRouter.route('/').get(getGameReservations);

gamesRouter
  .route('/:username')
  .post(authenticateToken, validateUser, postGameReservation);

export default gamesRouter;
