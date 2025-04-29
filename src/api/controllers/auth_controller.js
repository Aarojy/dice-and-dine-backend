import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {login} from '../models/user_model.js';

const getMe = async (req, res) => {
  if (req.user) {
    res.json({message: 'token ok', user: req.user});
  } else {
    res.sendStatus(401); // Unauthorized if no valid decoded data
  }
};

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
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({userWithNoPassword, token});
};

export {authUser, getMe};
