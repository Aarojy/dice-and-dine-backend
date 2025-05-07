import multer from 'multer';
import path from 'path';

/**
 * @module MulterConfig
 * @description Utility for handling file uploads using multer.
 */

/**
 * @constant {Object} storage
 * @description Configuration for multer to store files in the 'uploads' directory.
 * @property {Function} destination - Specifies the directory to save files.
 * @property {Function} filename - Specifies the naming convention for uploaded files.
 */

// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    const username = req.params.username; // Get the username from the route parameter
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${username}${ext}`);
  },
});

/**
 * @constant {Object} upload
 * @description Multer instance configured with the defined storage settings.
 */
export const upload = multer({storage});
