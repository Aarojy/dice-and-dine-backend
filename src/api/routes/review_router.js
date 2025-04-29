import {authenticateToken} from '../../middlewares.js';
import {validateUser} from '../routes/user_router.js';
import express from 'express';
import {
  getReviews,
  postReview,
  postAnonReview,
} from '../controllers/review_controller.js';

const reviewRouter = express.Router();

reviewRouter.route('/').get(getReviews);

reviewRouter.route('/').post(postAnonReview);

reviewRouter
  .route('/:username')
  .post(authenticateToken, validateUser, postReview);

export default reviewRouter;
