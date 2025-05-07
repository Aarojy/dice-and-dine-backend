import promisePool from '../../utils/database.js';

/**
 * @api {get} /api/v1/games/reservations Get All Game Reservations
 * @apiName GetGameReservations
 * @apiGroup Games
 *
 * @apiSuccess {Object[]} reservations List of all game reservations.
 * @apiSuccess {Number} reservations.id The unique ID of the reservation.
 * @apiSuccess {Number} reservations.customer The ID of the customer who made the reservation.
 * @apiSuccess {String} reservations.arrival_time The arrival time of the reservation.
 * @apiSuccess {String} reservations.departure_time The departure time of the reservation.
 * @apiSuccess {Object} reservations.customer The details of the customer (excluding password and user type).
 * @apiSuccess {Object} reservations.game The details of the reserved game.
 *
 * @apiError (404 Not Found) NoReservations No game reservations found.
 */
const listGameReservations = async () => {
  const [rows] = await promisePool.query('SELECT * FROM game_reservations');

  for (const row of rows) {
    const user = await promisePool.query(
      'SELECT * FROM registered_customers WHERE id = ?',
      [row.id]
    );
    // eslint-disable-next-line no-unused-vars
    const {password, user_type, ...userWithoutPassword} = user[0][0];
    row.customer = userWithoutPassword;

    const game = await promisePool.query(
      'SELECT * FROM boardgames WHERE id = ?',
      [row.game]
    );
    row.game = game[0][0];
  }

  return rows;
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
 * @apiSuccess {Number} reservation.customer The ID of the customer who made the reservation.
 * @apiSuccess {String} reservation.arrival_time The arrival time of the reservation.
 * @apiSuccess {String} reservation.departure_time The departure time of the reservation.
 * @apiSuccess {Object} reservation.customer The details of the customer (excluding password and user type).
 * @apiSuccess {Object} reservation.game The details of the reserved game.
 *
 * @apiError (404 Not Found) ReservationNotFound The game reservation was not found.
 */
const fetchGameReservation = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM game_reservations WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const user = await promisePool.query(
    'SELECT * FROM registered_customers WHERE id = ?',
    [rows[0].customer]
  );
  // eslint-disable-next-line no-unused-vars
  const {password, user_type, ...userWithoutPassword} = user[0][0];
  rows[0].customer = userWithoutPassword;

  const game = await promisePool.query(
    'SELECT * FROM boardgames WHERE id = ?',
    [rows[0].game]
  );
  rows[0].game = game[0][0];

  return rows[0];
};

/**
 * @api {post} /api/v1/games/reservations Create a New Game Reservation
 * @apiName CreateGameReservation
 * @apiGroup Games
 *
 * @apiBody {String} arrival_time The arrival time for the reservation.
 * @apiBody {String} departure_time The departure time for the reservation.
 * @apiBody {Number} game_id The ID of the reserved game.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created reservation.
 * @apiSuccess {Number} result.insertId The unique ID of the created reservation.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the game reservation.
 */
const createGameReservation = async (userId, order) => {
  const {arrival_time, departure_time, game_id} = order;

  // Insert into game_reservations
  const [reservationResult] = await promisePool.query(
    'INSERT INTO game_reservations (customer, arrival_time, departure_time, game) VALUES (?, ?, ?, ?)',
    [userId, arrival_time, departure_time, game_id]
  );

  return reservationResult;
};

export {listGameReservations, createGameReservation, fetchGameReservation};
