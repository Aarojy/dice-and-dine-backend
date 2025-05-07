import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {login} from '../models/user_model.js';

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
const getMe = async (req, res) => {
  if (req.user) {
    res.json({message: 'token ok', user: req.user});
  } else {
    res.sendStatus(401); // Unauthorized if no valid decoded data
  }
};

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
const authUser = async (req, res) => {
  const result = await login(req.body.username);
  if (!result) {
    res.sendStatus(401);
    return;
  }

  const passwordValid = bcrypt.compareSync(req.body.password, result.password);

  if (!passwordValid) {
    res.sendStatus(401);
    return;
  }

  const userWithNoPassword = {
    id: result.id,
    username: result.name,
    user_type: result.user_type,
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({userWithNoPassword, token});
};

export {authUser, getMe};
