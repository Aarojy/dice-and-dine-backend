import promisePool from '../../utils/database.js';
const menuTable = 'menu';
const allergensTable = 'allergens';
const restaurantTable = 'restaurant_info';
const boardgamesTable = 'boardgames';
const itemCategoriesTable = 'item_categories';
const gameCategoriesTable = 'game_category_table';

const getMenuFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${menuTable} WHERE lang="${lang}"`
  );
  return rows;
};

const getAllergensFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${allergensTable} WHERE lang="${lang}"`
  );
  return rows;
};

const getRestaurantFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${restaurantTable} WHERE lang="${lang}"`
  );
  return rows;
};

const getBoardgamesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${boardgamesTable} WHERE lang="${lang}"`
  );
  return rows;
};

const getItemCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${itemCategoriesTable} WHERE lang="${lang}"`
  );
  return rows;
};

const getGameCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${gameCategoriesTable} WHERE lang="${lang}"`
  );
  return rows;
};

export {
  getMenuFromDatabase,
  getAllergensFromDatabase,
  getRestaurantFromDatabase,
  getBoardgamesFromDatabase,
  getItemCategoriesFromDatabase,
  getGameCategoriesFromDatabase,
};
