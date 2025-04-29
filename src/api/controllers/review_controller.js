import {listReviews, createReview} from '../models/review_model.js';

export const getReviews = async (req, res) => {
  const result = await listReviews();
  if (result.length === 0) {
    res.status(404).json({message: 'No reviews found'});
    return;
  }
  res.json(result);
};

export const postAnonReview = async (req, res) => {
  const {review, rating} = req.body;

  if (!review) {
    res.status(400).json({message: 'Missing required fields'});
    return;
  }

  const result = await createReview(null, review, rating);

  if (!result) {
    res.status(500).json({message: 'Failed to create review'});
    return;
  }

  res.status(201).json(result);
};

export const postReview = async (req, res) => {
  const {review, rating} = req.body;

  if (!req.user.id || !review) {
    res.status(400).json({message: 'Missing required fields'});
    return;
  }

  const result = await createReview(req.user.id, review, rating);

  if (!result) {
    res.status(500).json({message: 'Failed to create review'});
    return;
  }

  res.status(201).json(result);
};

export default {getReviews, postReview};
