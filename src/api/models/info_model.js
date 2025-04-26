import promisePool from '../../utils/database.js';
const menu = 'menu';
const allergens = 'allergens';
const allergenTable = 'allergen_table';
const restaurant = 'restaurant_info';
const boardgames = 'boardgames';
const itemCategories = 'item_categories';
const itemCategoriesTable = 'category_table';
const gameCategories = 'game_categories';
const gameCategoriesTable = 'game_category_table';

const getMenuFromDatabase = async (lang) => {
  let result = [];

  // Fetch all menu items
  const [rows] = await promisePool.query(
    `SELECT * FROM ${menu} WHERE lang="${lang}"`
  );

  // Fetch all allergens for each menu item
  for (const row of rows) {
    const allergenRows = await promisePool.query(
      `SELECT * FROM ${allergenTable} WHERE menu_item_id=${row.id}`
    );

    let allergensList = [];
    for (const allergen_id of allergenRows[0]) {
      let allergen = await promisePool.query(
        `SELECT * FROM ${allergens} WHERE id=${allergen_id.allergen_id}`
      );

      allergensList.push(allergen[0][0].name);
    }

    row.allergens = allergensList;
    result.push(row);
  }

  // Fetch all categories for each menu item
  for (const row of rows) {
    const categoryRows = await promisePool.query(
      `SELECT * FROM ${itemCategoriesTable} WHERE menu_item_id=${row.id}`
    );

    let categoriesList = [];
    for (const category_id of categoryRows[0]) {
      let category = await promisePool.query(
        `SELECT * FROM ${itemCategories} WHERE id=${category_id.category_id}`
      );

      categoriesList.push(category[0][0].name);
    }

    row.categories = categoriesList;
  }

  return result;
};

const getMenuItemFromDatabase = async (id) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${menu} WHERE id=${id}`
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  // Fetch allergens for the menu item
  const allergenRows = await promisePool.query(
    `SELECT * FROM ${allergenTable} WHERE menu_item_id=${row.id}`
  );

  let allergensList = [];
  for (const allergen_id of allergenRows[0]) {
    let allergen = await promisePool.query(
      `SELECT * FROM ${allergens} WHERE id=${allergen_id.allergen_id}`
    );

    allergensList.push(allergen[0][0].name);
  }

  row.allergens = allergensList;

  // Fetch categories for the menu item
  const categoryRows = await promisePool.query(
    `SELECT * FROM ${itemCategoriesTable} WHERE menu_item_id=${row.id}`
  );

  let categoriesList = [];
  for (const category_id of categoryRows[0]) {
    let category = await promisePool.query(
      `SELECT * FROM ${itemCategories} WHERE id=${category_id.category_id}`
    );

    categoriesList.push(category[0][0].name);
  }

  row.categories = categoriesList;

  return row;
};

const getAllergensFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${allergens} WHERE lang="${lang}"`
  );
  return rows;
};

const getRestaurantFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${restaurant} WHERE lang="${lang}"`
  );
  return rows;
};

const getBoardgamesFromDatabase = async (lang) => {
  let result = [];

  const [rows] = await promisePool.query(
    `SELECT * FROM ${boardgames} WHERE lang="${lang}"`
  );

  // Fetch all categories for each game
  for (const row of rows) {
    const categoryRows = await promisePool.query(
      `SELECT * FROM ${gameCategoriesTable} WHERE game_id=${row.id}`
    );

    let categoriesList = [];
    for (const category_id of categoryRows[0]) {
      let category = await promisePool.query(
        `SELECT * FROM ${gameCategories} WHERE id=${category_id.game_category_id}`
      );

      categoriesList.push(category[0][0].name);
    }

    row.categories = categoriesList;
    result.push(row);
  }

  return rows;
};

const getItemCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${itemCategories} WHERE lang="${lang}"`
  );
  return rows;
};

const getGameCategoriesFromDatabase = async (lang) => {
  const [rows] = await promisePool.query(
    `SELECT * FROM ${gameCategories} WHERE lang="${lang}"`
  );
  return rows;
};

export {
  getMenuFromDatabase,
  getMenuItemFromDatabase,
  getAllergensFromDatabase,
  getRestaurantFromDatabase,
  getBoardgamesFromDatabase,
  getItemCategoriesFromDatabase,
  getGameCategoriesFromDatabase,
};
