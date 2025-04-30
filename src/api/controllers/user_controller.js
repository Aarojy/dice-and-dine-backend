import {
  addUser,
  findUserById,
  updateUserProfileImage,
  modifyUser,
} from '../models/user_model.js';
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

const uploadProfileImage = async (req, res) => {
  try {
    const filename = req.file.filename;
    await updateUserProfileImage(req.user.id, filename);
    res.send({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({message: 'Failed to upload image or update user'});
  }
};

const putUser = async (req, res) => {
  try {
    const {id} = req.params;
    let {username, password, email, user_type} = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const userUpdateData = {
      ...(username && {username}),
      ...(hashedPassword && {password: hashedPassword}),
      ...(email && {email}),
      ...(user_type && {user_type}),
    };

    if (Object.keys(userUpdateData).length === 0) {
      return res.status(400).json({error: 'No fields to update'});
    }

    const result = await modifyUser(id, userUpdateData);
    if (result.message === 'User updated successfully') {
      res.status(200).json({message: 'User updated successfully'});
    } else if (result.message === 'No changes made') {
      res.status(404).json({error: 'User not found or no changes made'});
    } else {
      res.status(400).json({error: result.message});
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

export {postUser, getUserById, uploadProfileImage, putUser};
