import express from 'express';
import authRouter from './routes/auth_router.js';
import userRouter from './routes/user_router.js';
import infoRouter from './routes/info_router.js';
import orderRouter from './routes/order_router.js';
import tableRouter from './routes/table_router.js';
import reviewRouter from './routes/review_router.js';
import forumRouter from './routes/forum_router.js';
import gamesRouter from './routes/games_router.js';

/**
 * @apiDefine AuthRoutes Authentication Routes
 * Routes related to user authentication.
 */

/**
 * @apiDefine UserRoutes User Management Routes
 * Routes for managing user accounts and profiles.
 */

/**
 * @apiDefine ReviewRoutes Review Management Routes
 * Routes for managing reviews.
 */

/**
 * @apiDefine InfoRoutes Information Routes
 * Routes for fetching and updating restaurant and menu information.
 */

/**
 * @apiDefine OrderRoutes Order Management Routes
 * Routes for managing orders and menu items.
 */

/**
 * @apiDefine TableRoutes Table Management Routes
 * Routes for managing table reservations and orders.
 */

/**
 * @apiDefine ForumRoutes Forum Routes
 * Routes for managing forum posts and replies.
 */

/**
 * @apiDefine GameRoutes Game Reservation Routes
 * Routes for managing game reservations.
 */

const router = express.Router();

/**
 * @api {use} /api/v1/auth Authentication Routes
 * @apiGroup AuthRoutes
 * @apiDescription Routes related to user authentication.
 */
router.use('/auth', authRouter);

/**
 * @api {use} /api/v1/users User Management Routes
 * @apiGroup UserRoutes
 * @apiDescription Routes for managing user accounts and profiles.
 */
router.use('/users', userRouter);

/**
 * @api {use} /api/v1/review Review Management Routes
 * @apiGroup ReviewRoutes
 * @apiDescription Routes for managing reviews.
 */
router.use('/review', reviewRouter);

/**
 * @api {use} /api/v1/info Information Routes
 * @apiGroup InfoRoutes
 * @apiDescription Routes for fetching and updating restaurant and menu information.
 */
router.use('/info', infoRouter);

/**
 * @api {use} /api/v1/orders Order Management Routes
 * @apiGroup OrderRoutes
 * @apiDescription Routes for managing orders and menu items.
 */
router.use('/orders', orderRouter);

/**
 * @api {use} /api/v1/tables Table Management Routes
 * @apiGroup TableRoutes
 * @apiDescription Routes for managing table reservations and orders.
 */
router.use('/tables', tableRouter);

/**
 * @api {use} /api/v1/forum Forum Routes
 * @apiGroup ForumRoutes
 * @apiDescription Routes for managing forum posts and replies.
 */
router.use('/forum', forumRouter);

/**
 * @api {use} /api/v1/games Game Reservation Routes
 * @apiGroup GameRoutes
 * @apiDescription Routes for managing game reservations.
 */
router.use('/games', gamesRouter);

export default router;
