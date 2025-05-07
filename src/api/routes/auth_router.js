import {authUser, getMe} from '../controllers/auth_controller.js';
import express from 'express';
import {authenticateToken} from '../../middlewares.js';

const authRouter = express.Router();

/**
 * @api {post} /api/v1/auth/login Authenticate User
 * @apiName AuthenticateUser
 * @apiGroup Authentication
 *
 * @apiBody {String} username The username of the user.
 * @apiBody {String} password The password of the user.
 *
 * @apiSuccess {Object} userWithNoPassword The authenticated user's details (excluding the password).
 * @apiSuccess {Number} userWithNoPassword.id The user's unique ID.
 * @apiSuccess {String} userWithNoPassword.username The username of the user.
 * @apiSuccess {String} userWithNoPassword.user_type The type of the user (e.g., admin, customer).
 * @apiSuccess {String} token The JWT token for authentication.
 *
 * @apiError (401 Unauthorized) Unauthorized Invalid username or password.
 */
authRouter.route('/login').post(authUser);

/**
 * @api {get} /api/v1/auth/me Get Current User
 * @apiName GetCurrentUser
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Confirmation message ("token ok").
 * @apiSuccess {Object} user The authenticated user's details.
 * @apiSuccess {Number} user.id The user's unique ID.
 * @apiSuccess {String} user.username The username of the user.
 * @apiSuccess {String} user.user_type The type of the user (e.g., admin, customer).
 *
 * @apiError (401 Unauthorized) Unauthorized Invalid or missing token.
 */
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
