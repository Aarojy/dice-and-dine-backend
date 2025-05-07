/* eslint-disable no-unused-vars */
import express from 'express';
import {
  postUser,
  getUserById,
  uploadProfileImage,
  putUser,
} from '../controllers/user_controller.js';
import {upload} from '../../utils/multer.js';
import {authenticateToken} from '../../middlewares.js';

const userRouter = express.Router();

export const validateUser = (req, res, next) => {
  const usernameFromRequest = req.params.username;
  console.log(req.user);

  if (!req.user || !req.user.username) {
    return res.status(403).send({message: 'Invalid user data'});
  }

  if (req.user.username !== usernameFromRequest) {
    return res.status(403).send({message: 'Invalid token'});
  }

  next();
};

export const validateUserById = (req, res, next) => {
  const userIdFromRequest = Number(req.params.id);

  if (!req.user || typeof req.user.id === 'undefined') {
    return res.status(403).send({message: 'Invalid user data'});
  }

  if (req.user.id !== userIdFromRequest) {
    return res.status(403).send({message: 'Invalid token or user mismatch'});
  }

  next();
};

/**
 * @api {post} /api/v1/users Add a New User
 * @apiName PostUser
 * @apiGroup Users
 *
 * @apiBody {String} username The username of the user.
 * @apiBody {String} password The password of the user.
 * @apiBody {String} email The email address of the user.
 * @apiBody {String} [user_type="customer"] The type of the user (e.g., admin, customer).
 *
 * @apiSuccess {Object} user The details of the created user.
 *
 * @apiError (500 Internal Server Error) FailedToAdd Failed to add the user.
 */
userRouter.post('/', async (req, res) => {
  try {
    const newUser = await postUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({error: 'Failed to add user'});
  }
});

/**
 * @api {post} /api/v1/users/img/:username Upload Profile Image
 * @apiName UploadProfileImage
 * @apiGroup Users
 *
 * @apiParam {String} username The username of the user.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiBody {File} file The profile image file to upload.
 *
 * @apiSuccess {String} message Success message indicating the file was uploaded.
 *
 * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
 * @apiError (500 Internal Server Error) FailedToUpload Failed to upload the profile image.
 */
userRouter.post(
  '/img/:username',
  authenticateToken,
  validateUser,
  upload.single('file'),
  uploadProfileImage
);

/**
 * @api {get} /api/v1/users/:id Get User by ID
 * @apiName GetUserById
 * @apiGroup Users
 *
 * @apiParam {Number} id The unique ID of the user.
 *
 * @apiSuccess {Object} user The details of the user.
 *
 * @apiError (404 Not Found) UserNotFound The user was not found.
 */
userRouter
  .route('/:id')
  .get(getUserById)

  /**
   * @api {put} /api/v1/users/:id Update User
   * @apiName PutUser
   * @apiGroup Users
   *
   * @apiParam {Number} id The unique ID of the user.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiBody {String} [username] The new username of the user.
   * @apiBody {String} [password] The new password of the user.
   * @apiBody {String} [email] The new email address of the user.
   * @apiBody {String} [user_type] The new type of the user (e.g., admin, customer).
   *
   * @apiSuccess {String} message Success message indicating the user was updated.
   *
   * @apiError (403 Forbidden) Unauthorized The user is not authorized to perform this action.
   * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the user.
   */
  .put(authenticateToken, validateUserById, async (req, res) => {
    try {
      await putUser(req, res);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  });
export default userRouter;
