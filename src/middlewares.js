import jwt from 'jsonwebtoken';
import 'dotenv/config';

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
      username: decoded.name,
    };
    //console.log('req.user', req.user);
    next();

    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

export {authenticateToken};
