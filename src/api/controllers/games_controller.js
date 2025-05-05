import {
  listGameReservations,
  createGameReservation,
} from '../models/games_model.js';

const getGameReservations = async (req, res) => {
  const result = await listGameReservations();
  if (result.length === 0) {
    res.status(404).json({message: 'No game reservations found'});
    return;
  }
  res.json(result);
};

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

export {getGameReservations, postGameReservation};
