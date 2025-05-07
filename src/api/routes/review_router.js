import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import express from 'express';
import {
  getReviews,
  postReview,
  postAnonReview,
} from '../controllers/review_controller.js';

const reviewRouter = express.Router();

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
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the reviews.
 */
reviewRouter.route('/').get(getReviews);

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
reviewRouter.route('/').post(postAnonReview);

/**
 * @api {post} /api/v1/reviews/:username Post Review
 * @apiName PostReview
 * @apiGroup Reviews
 *
 * @apiParam {String} username The username of the user posting the review.
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
reviewRouter
  .route('/:username')
  .post(authenticateToken, validateUser, postReview);

export default reviewRouter;
