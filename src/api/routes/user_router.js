/* eslint-disable no-unused-vars */
import express from 'express';
import {postUser} from '../controllers/user_controller.js';
import {upload} from '../../utils/multer.js';
import {getMe} from '../controllers/auth_controller.js';
import {authenticateToken} from '../../middlewares.js';
import {postFavorite, getFavorite} from '../models/user_model.js';

const userRouter = express.Router();

const validateUser = (req, res, next) => {
  getMe(req, res, next);
  if (!res.locals.user) {
    return res.status(401).json({error: 'Unauthorized'});
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

userRouter.get('/favorite/:username', authenticateToken, async (req, res) => {
  const favorite = await getFavorite(req.params.username);
  if (favorite) {
    res.status(200).json(favorite);
  } else {
    res.status(404).json({error: 'Favorite not found'});
  }
});

userRouter.post(
  '/favorite/:username',
  authenticateToken,
  validateUser,
  async (req, res) => {
    try {
      const username = req.params.username; // Extract username from route parameter
      const {favorite} = req.body; // Extract favorite from request body

      if (!favorite) {
        return res.status(400).json({error: 'Favorite is required'}); // Return to stop further execution
      }

      const response = await postFavorite(username, favorite);

      if (response.affectedRows > 0) {
        return res
          .status(200)
          .json({message: `Favorite added successfully for user ${username}`}); // Return to stop further execution
      } else {
        return res
          .status(404)
          .json({error: `User with username ${username} not found`}); // Return to stop further execution
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      if (!res.headersSent) {
        res.status(500).json({error: 'Internal server error'}); // Send error response only if headers are not already sent
      }
    }
  }
);

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
