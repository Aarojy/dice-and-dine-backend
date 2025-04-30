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

userRouter.post('/', async (req, res) => {
  try {
    const newUser = await postUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({error: 'Failed to add user'});
  }
});

userRouter.post(
  '/img/:username',
  authenticateToken,
  validateUser,
  upload.single('file'),
  uploadProfileImage
);

userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, validateUserById, putUser);

export default userRouter;
