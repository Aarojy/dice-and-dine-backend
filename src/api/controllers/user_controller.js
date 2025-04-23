import {addUser} from '../models/user_model.js';
import bcrypt from 'bcrypt';

const postUser = async (req, res) => {
  try {
    const {username, password} = req;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({error: 'Missing required fields'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    // Save the user to the database
    const result = await addUser({
      username,
      password: hashedPassword,
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

export {postUser};
