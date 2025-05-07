import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * @module Middlewares
 * @description Middleware functions for handling authentication.
 */

/**
 * @function authenticateToken
 * @description Middleware to authenticate a user based on a JWT token.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.headers - The headers of the request.
 * @param {string} req.headers.authorization - The authorization header containing the JWT token.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {Error} 401 Unauthorized if no token is provided.
 * @throws {Error} 403 Forbidden if the token is invalid.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      user_type: decoded.user_type,
    };
    next();

    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

export {authenticateToken};
