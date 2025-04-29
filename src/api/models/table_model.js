import promisePool from '../../utils/database.js';

export const listTableOrders = async () => {
  const [rows] = await promisePool.query('SELECT * FROM table_reservations');

  return rows;
};

export const createReservation = async (customer_id, reservation) => {
  const {
    arrival_time,
    departure_time,
    reservation_size,
    additional_information,
    tables,
  } = reservation;

  // Insert into table_reservations
  const [reservationResult] = await promisePool.query(
    'INSERT INTO table_reservations (customer, arrival_time, departure_time, reservation_size, additional_information) VALUES (?, ?, ?, ?, ?)',
    [
      customer_id,
      arrival_time,
      departure_time,
      reservation_size,
      additional_information,
    ]
  );

  const reservationId = reservationResult.insertId; // Get the generated reservation ID

  // Insert into table_table for each table
  for (const table of tables) {
    await promisePool.query(
      'INSERT INTO table_table (reservation_id, table_id) VALUES (?, ?)',
      [reservationId, table.table_id]
    );
  }

  return {reservation_id: reservationId};
};

export default {listTableOrders};
