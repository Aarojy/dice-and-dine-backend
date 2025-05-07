import promisePool from '../../utils/database.js';

/**
 * @api {get} /api/v1/reviews Get All Reviews
 * @apiName GetReviews
 * @apiGroup Reviews
 *
 * @apiSuccess {Object[]} reviews List of all reviews.
 * @apiSuccess {Number} reviews.id The unique ID of the review.
 * @apiSuccess {Number} reviews.customer The ID of the customer who wrote the review (if available).
 * @apiSuccess {String} reviews.review_text The content of the review.
 * @apiSuccess {String} reviews.time The time the review was created.
 * @apiSuccess {Number} reviews.rating The rating of the review.
 *
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while fetching the reviews.
 */
const listReviews = async () => {
  const [rows] = await promisePool.query('SELECT * FROM reviews');
  return rows;
};

/**
 * @api {post} /api/v1/reviews Create a New Review
 * @apiName CreateReview
 * @apiGroup Reviews
 *
 * @apiBody {Number} [user_id] The ID of the user writing the review (optional for anonymous reviews).
 * @apiBody {String} review The content of the review.
 * @apiBody {Number} [rating] The rating of the review (optional).
 *
 * @apiSuccess {Object} review The details of the created review.
 * @apiSuccess {Number} review.id The unique ID of the review.
 * @apiSuccess {Number} [review.user_id] The ID of the user who wrote the review (if available).
 * @apiSuccess {String} review.review The content of the review.
 * @apiSuccess {Number} [review.rating] The rating of the review.
 *
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) FailedToCreate Failed to create the review.
 */
const createReview = async (user_id, review, rating) => {
  if (user_id) {
    const [result] = await promisePool.query(
      'INSERT INTO reviews (customer, review_text, time, rating) VALUES (?, ?, ?, ?)',
      [user_id, review, new Date(), rating]
    );

    return {id: result.insertId, user_id, review, rating};
  } else {
    const [result] = await promisePool.query(
      'INSERT INTO reviews (review_text, time, rating) VALUES (?, ?, ?)',
      [review, new Date(), rating]
    );

    return {id: result.insertId, user_id, review, rating};
  }
};

export {createReview, listReviews};
