import {
  addUser,
  findUserById,
  updateUserProfileImage,
  modifyUser,
} from '../models/user_model.js';
import bcrypt from 'bcrypt';

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
 * @apiError (400 Bad Request) MissingFields Missing required fields.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while adding the user.
 */
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
const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

/**
 * @api {post} /api/v1/users/profile-image Upload Profile Image
 * @apiName UploadProfileImage
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {String} message Success message indicating the file was uploaded.
 * @apiSuccess {Object} file The details of the uploaded file.
 *
 * @apiError (500 Internal Server Error) FailedToUpload Failed to upload the image or update the user.
 */
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

/**
 * @api {put} /api/v1/users/:id Update User
 * @apiName PutUser
 * @apiGroup Users
 *
 * @apiParam {Number} id The unique ID of the user.
 *
 * @apiBody {String} [username] The new username of the user.
 * @apiBody {String} [password] The new password of the user.
 * @apiBody {String} [email] The new email address of the user.
 * @apiBody {String} [user_type] The new type of the user (e.g., admin, customer).
 * @apiBody {String} [oldpassword] The old password of the user (required if updating the password).
 *
 * @apiSuccess {String} message Success message indicating the user was updated.
 *
 * @apiError (400 Bad Request) MissingFields No fields to update or old password is missing.
 * @apiError (403 Forbidden) IncorrectOldPassword The old password is incorrect.
 * @apiError (404 Not Found) UserNotFound The user was not found.
 * @apiError (500 Internal Server Error) InternalServerError An error occurred while updating the user.
 */
const putUser = async (req, res) => {
  try {
    const {id} = req.params;
    let {username, password, email, user_type, oldpassword} = req.body;
    let hashedPassword;
    if (password) {
      if (!oldpassword) {
        return res.status(400).json({message: 'Old password is required'});
      }
      const user = await findUserById(id);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      const passwordMatch = await bcrypt.compare(oldpassword, user.password);
      if (!passwordMatch) {
        return res.status(403).json({message: 'Incorrect old password'});
      }
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
