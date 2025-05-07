import mysql from 'mysql2';
import 'dotenv/config';

/**
 * @module Database
 * @description Utility for managing database connections using MySQL.
 */

/**
 * @constant {Object} pool
 * @description A MySQL connection pool for managing database connections.
 * @property {string} host - The database host, retrieved from environment variables.
 * @property {string} user - The database user, retrieved from environment variables.
 * @property {string} password - The database password, retrieved from environment variables.
 * @property {string} database - The database name, retrieved from environment variables.
 * @property {boolean} waitForConnections - Whether to wait for connections when the pool is full.
 * @property {number} connectionLimit - The maximum number of connections in the pool.
 * @property {number} queueLimit - The maximum number of connection requests in the queue.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * @constant {Object} promisePool
 * @description A promise-based MySQL connection pool for executing queries.
 */
const promisePool = pool.promise();
export default promisePool;
