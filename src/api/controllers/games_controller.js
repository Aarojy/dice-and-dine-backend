import {
  listGameReservations,
  createGameReservation,
  fetchGameReservation,
} from '../models/games_model.js';

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
const getGameReservations = async (req, res) => {
  const result = await listGameReservations();
  if (result.length === 0) {
    res.status(404).json({message: 'No game reservations found'});
    return;
  }
  res.json(result);
};

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
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (404 Not Found) NoReservation No game reservation found with the given ID.
 */
const getGameReservationById = async (req, res) => {
  const {id} = req.params;

  if (!id) {
    res.status(400).json({message: 'Missing required fields'});
    return;
  }

  const result = await fetchGameReservation(id);

  if (result.length === 0) {
    res.status(404).json({message: 'No game reservation found'});
    return;
  }
  res.json(result);
};

/**
 * @api {post} /api/v1/games/reservations Create a New Game Reservation
 * @apiName PostGameReservation
 * @apiGroup Games
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
 * @apiSuccess {Number} result.user_id The ID of the user who made the reservation.
 * @apiSuccess {String} result.reservation_time The time of the reservation.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the game reservation.
 */
const postGameReservation = async (req, res) => {
  const {reservation} = req.body;

  if (!req.user.id || !reservation) {
    res.status(400).json({message: 'Missing required fields'});
    return;
  }

  const result = await createGameReservation(req.user.id, reservation);

  if (!result) {
    res.status(500).json({message: 'Failed to create game reservation'});
    return;
  }

  res.status(201).json(result);
};

export {getGameReservations, postGameReservation, getGameReservationById};
