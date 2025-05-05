import promisePool from '../../utils/database.js';

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
