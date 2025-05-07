import {listReviews, createReview} from '../models/review_model.js';

/**
 * @api {get} /api/v1/reviews Get All Reviews
 * @apiName GetReviews
 * @apiGroup Reviews
 *
 * @apiSuccess {Object[]} reviews List of all reviews.
 * @apiSuccess {Number} reviews.id The unique ID of the review.
 * @apiSuccess {String} reviews.review The content of the review.
 * @apiSuccess {Number} reviews.rating The rating of the review.
 *
 * @apiError (404 Not Found) NoReviews No reviews found.
 */
export const getReviews = async (req, res) => {
  const result = await listReviews();
  if (result.length === 0) {
    res.status(404).json({message: 'No reviews found'});
    return;
  }
  res.json(result);
};

/**
 * @api {post} /api/v1/reviews/anonymous Post Anonymous Review
 * @apiName PostAnonReview
 * @apiGroup Reviews
 *
 * @apiBody {String} review The content of the review.
 * @apiBody {Number} [rating] The rating of the review (optional).
 *
 * @apiSuccess {Object} result The details of the created review.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the review.
 */
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

/**
 * @api {post} /api/v1/reviews Post Review
 * @apiName PostReview
 * @apiGroup Reviews
 *
 * @apiBody {String} review The content of the review.
 * @apiBody {Number} [rating] The rating of the review (optional).
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} result The details of the created review.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the review.
 */
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
