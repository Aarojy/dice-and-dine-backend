/* eslint-disable no-unused-vars */
import express from 'express';
import {postUser} from '../controllers/user_controller.js';
import {upload} from '../../utils/multer.js';
import {authenticateToken} from '../../middlewares.js';

const userRouter = express.Router();

export const validateUser = (req, res, next) => {
  const usernameFromRequest = req.params.username;

  if (res.decoded.username !== usernameFromRequest) {
    return res.status(403).send({message: 'invalid token'});
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
  (req, res) => {
    res.send({message: 'File uploaded successfully', file: req.file});
  }
);

export default userRouter;
