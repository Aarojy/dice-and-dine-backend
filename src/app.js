/**
 * @file app.js
 * @description Entry point for the Express application, configuring middleware, routes, and static file serving.
 */

import express from 'express';
import api from './api/index.js';
import cors from 'cors';

/**
 * @constant {Object} app
 * @description The Express application instance.
 */
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * @function
 * @name GET /
 * @description Root route of the application.
 * @returns {String} Welcome message.
 */
app.get('/', (req, res) => {
  res.send('Welcome to REST API!');
});

/**
 * @function
 * @name use /api/v1
 * @description Mounts the API routes under the `/api/v1` path.
 */
app.use('/api/v1', api);

/**
 * @function
 * @name use /uploads
 * @description Serves static files from the `uploads` directory.
 */
app.use('/uploads', express.static('uploads'));

export default app;
