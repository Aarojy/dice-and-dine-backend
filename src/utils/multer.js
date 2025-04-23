import multer from 'multer';
import path from 'path';

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

export const upload = multer({storage});
