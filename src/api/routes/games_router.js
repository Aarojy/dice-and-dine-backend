import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import express from 'express';
import {
  getGameReservations,
  postGameReservation,
  getGameReservationById,
} from '../controllers/games_controller.js';

const gamesRouter = express.Router();

/**
 * @api {get} /api/v1/games/reservations Get All Game Reservations
 * @apiName GetGameReservations
 * @apiGroup Games
 *
 * @apiSuccess {Object[]} reservations List of all game reservations.
 * @apiSuccess {Number} reservations.id The unique ID of the reservation.
 * @apiSuccess {Number} reservations.user_id The ID of the user who made the reservation.
 * @apiSuccess {String} reservations.reservation_time The time of the reservation.
 *
 * @apiError (404 Not Found) NoReservations No game reservations found.
 */
gamesRouter.route('/').get(getGameReservations);

/**
 * @api {get} /api/v1/games/reservations/:id Get Game Reservation by ID
 * @apiName GetGameReservationById
 * @apiGroup Games
 *
 * @apiParam {Number} id The unique ID of the game reservation.
 *
 * @apiSuccess {Object} reservation The details of the game reservation.
 * @apiSuccess {Number} reservation.id The unique ID of the reservation.
 * @apiSuccess {Number} reservation.user_id The ID of the user who made the reservation.
 * @apiSuccess {String} reservation.reservation_time The time of the reservation.
 *
 * @apiError (404 Not Found) ReservationNotFound The game reservation was not found.
 */
gamesRouter.route('/:id').get(getGameReservationById);

/**
 * @api {post} /api/v1/games/reservations/:username Create a New Game Reservation
 * @apiName PostGameReservation
 * @apiGroup Games
 *
 * @apiParam {String} username The username of the user making the reservation.
 *
 * @apiBody {Object} reservation The details of the reservation.
 * @apiBody {String} reservation.arrival_time The arrival time for the reservation.
 * @apiBody {String} reservation.departure_time The departure time for the reservation.
 * @apiBody {Number} reservation.game_id The ID of the reserved game.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created reservation.
 * @apiSuccess {Number} result.id The unique ID of the reservation.
 * @apiSuccess {String} message Success message indicating the reservation was created.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the game reservation.
 */
gamesRouter
  .route('/:username')
  .post(authenticateToken, validateUser, postGameReservation);

export default gamesRouter;
