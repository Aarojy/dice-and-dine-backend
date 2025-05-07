import app from './app.js';
/**
 * @file index.js
 * @description Entry point for starting the Express server.
 */

/**
 * @constant {string} hostname
 * @description The hostname where the server will run.
 */
const hostname = '127.0.0.1';

/**
 * @constant {number} port
 * @description The port number where the server will listen for requests.
 */
const port = 3001;

/**
 * @function
 * @name listen
 * @description Starts the server and listens for incoming requests on the specified hostname and port.
 * @param {number} port - The port number.
 * @param {string} hostname - The hostname.
 * @param {Function} callback - Callback function executed when the server starts.
 */
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
