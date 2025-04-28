import {addUser, findUserById} from '../models/user_model.js';
import bcrypt from 'bcrypt';

const postUser = async (req, res) => {
  try {
    let {username, password, email, user_type} = req;

    // if user_type is not provided, default to 'customer'
    if (!user_type) {
      user_type = 'customer';
    }

    // Validate required fields
    if (!username || !password || !email || !user_type) {
      return res.status(400).json({error: 'Missing required fields'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    // Save the user to the database
    const result = await addUser({
      username,
      password: hashedPassword,
      email,
      user_type,
    });

    if (result.user_id) {
      return result;
    } else {
      return res.status(400).json({error: 'Failed to add user'});
    }
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

export {postUser, getUserById};
